/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  clampPct,
  demoData,
  PIETRA_OWNER_NAME,
  type Diario,
  type Disciplina,
  type ItemControle,
  type Obra,
  type Pendencia,
  type PietraData,
} from "@/lib/data";
import {
  deleteRemoteDiario,
  deleteRemoteDisciplina,
  deleteRemoteItemControle,
  deleteRemoteObra,
  deleteRemotePendencia,
  isSupabaseConfigured,
  loadCachedData,
  saveCachedData,
  saveRemoteActiveObra,
  saveRemoteDiario,
  saveRemoteDisciplina,
  saveRemoteItemControle,
  saveRemoteObra,
  saveRemotePendencia,
  seedRemoteIfEmpty,
  type PersistenceMode,
} from "@/lib/persistence";

type StoreContextValue = {
  data: PietraData;
  activeObra: Obra;
  setActiveObra: (obraId: string) => void;
  saveObra: (obra: Obra) => void;
  deleteObra: (obraId: string) => void;
  saveDisciplina: (disciplina: Disciplina) => void;
  deleteDisciplina: (disciplinaId: string) => void;
  saveItemControle: (item: ItemControle) => void;
  deleteItemControle: (itemId: string) => void;
  savePendencia: (pendencia: Pendencia) => void;
  deletePendencia: (pendenciaId: string) => void;
  saveDiario: (diario: Diario) => void;
  deleteDiario: (diarioId: string) => void;
  resetDemoData: () => void;
  persistenceMode: PersistenceMode;
  syncError: string | null;
};

const StoreContext = createContext<StoreContextValue | null>(null);

function createId(prefix: string) {
  const random = globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2, 10);
  return `${prefix}-${random}`;
}

export function createObraId() {
  return createId("obra");
}

export function createDisciplinaId() {
  return createId("disc");
}

export function createItemControleId() {
  return createId("item");
}

export function createPendenciaId() {
  return createId("PD");
}

export function createDiarioId() {
  return createId("DC");
}

function touch(data: PietraData): PietraData {
  return { ...data, updatedAt: new Date().toISOString() };
}

function normalizeObra(obra: Obra): Obra {
  if (
    obra.responsavel.includes("Marcos Andrade") ||
    obra.responsavel.includes("Engª Anibal Nisgoski")
  ) {
    return { ...obra, responsavel: PIETRA_OWNER_NAME };
  }

  return obra;
}

function normalizeData(value: unknown): PietraData {
  if (!value || typeof value !== "object") return demoData;

  const candidate = value as Partial<PietraData>;
  const obras =
    Array.isArray(candidate.obras) && candidate.obras.length > 0
      ? candidate.obras.map(normalizeObra)
      : demoData.obras;
  const activeObraId =
    typeof candidate.activeObraId === "string" &&
    obras.some((obra) => obra.id === candidate.activeObraId)
      ? candidate.activeObraId
      : obras[0].id;

  return {
    activeObraId,
    obras,
    disciplinas: Array.isArray(candidate.disciplinas)
      ? candidate.disciplinas
      : demoData.disciplinas,
    itensControle: Array.isArray(candidate.itensControle)
      ? candidate.itensControle
      : demoData.itensControle,
    pendencias: Array.isArray(candidate.pendencias) ? candidate.pendencias : demoData.pendencias,
    diarios: Array.isArray(candidate.diarios) ? candidate.diarios : demoData.diarios,
    updatedAt: typeof candidate.updatedAt === "string" ? candidate.updatedAt : demoData.updatedAt,
  };
}

export function PietraDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PietraData>(demoData);
  const dataRef = useRef<PietraData>(demoData);
  const [hydrated, setHydrated] = useState(false);
  const [persistenceMode, setPersistenceMode] = useState<PersistenceMode>(
    isSupabaseConfigured() ? "supabase" : "local",
  );
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const cached = normalizeData(loadCachedData() ?? demoData);
    dataRef.current = cached;
    setData(cached);

    if (!isSupabaseConfigured()) {
      setPersistenceMode("local");
      setHydrated(true);
      return;
    }

    setPersistenceMode("supabase");
    seedRemoteIfEmpty(cached)
      .then((remoteData) => {
        if (cancelled) return;
        const normalized = normalizeData(remoteData);
        dataRef.current = normalized;
        setData(normalized);
        saveCachedData(normalized);
        setSyncError(null);
        setHydrated(true);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setPersistenceMode("local");
        setSyncError(error instanceof Error ? error.message : "Falha ao sincronizar dados reais.");
        setHydrated(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveCachedData(data);
  }, [data, hydrated]);

  const commitData = useCallback(
    (
      updater: (current: PietraData) => PietraData,
      remoteOperation?: (nextData: PietraData) => Promise<void>,
    ) => {
      const nextData = touch(normalizeData(updater(dataRef.current)));
      dataRef.current = nextData;
      setData(nextData);
      saveCachedData(nextData);

      if (!remoteOperation || !isSupabaseConfigured()) return;

      setPersistenceMode("supabase");
      setSyncError(null);
      void remoteOperation(nextData).catch((error: unknown) => {
        setPersistenceMode("local");
        setSyncError(error instanceof Error ? error.message : "Falha ao salvar no Supabase.");
      });
    },
    [],
  );

  const setActiveObra = useCallback(
    (obraId: string) => {
      commitData(
        (current) =>
          current.obras.some((obra) => obra.id === obraId)
            ? { ...current, activeObraId: obraId }
            : current,
        async (nextData) => {
          await saveRemoteActiveObra(nextData.activeObraId);
        },
      );
    },
    [commitData],
  );

  const saveObra = useCallback(
    (obra: Obra) => {
      const normalized = normalizeObra(obra);

      commitData(
        (current) => {
          const exists = current.obras.some((item) => item.id === normalized.id);
          return {
            ...current,
            activeObraId: current.activeObraId || normalized.id,
            obras: exists
              ? current.obras.map((item) => (item.id === normalized.id ? normalized : item))
              : [...current.obras, normalized],
          };
        },
        async () => {
          await saveRemoteObra(normalized);
        },
      );
    },
    [commitData],
  );

  const deleteObra = useCallback(
    (obraId: string) => {
      if (dataRef.current.obras.length <= 1) return;

      commitData(
        (current) => {
          const obras = current.obras.filter((obra) => obra.id !== obraId);
          const activeObraId = current.activeObraId === obraId ? obras[0].id : current.activeObraId;

          return {
            ...current,
            activeObraId,
            obras,
            disciplinas: current.disciplinas.filter((item) => item.obraId !== obraId),
            itensControle: current.itensControle.filter((item) => item.obraId !== obraId),
            pendencias: current.pendencias.filter((item) => item.obraId !== obraId),
            diarios: current.diarios.filter((item) => item.obraId !== obraId),
          };
        },
        async (nextData) => {
          await deleteRemoteObra(obraId);
          await saveRemoteActiveObra(nextData.activeObraId);
        },
      );
    },
    [commitData],
  );

  const saveDisciplina = useCallback(
    (disciplina: Disciplina) => {
      commitData(
        (current) => {
          const exists = current.disciplinas.some((item) => item.id === disciplina.id);
          return {
            ...current,
            disciplinas: exists
              ? current.disciplinas.map((item) => (item.id === disciplina.id ? disciplina : item))
              : [...current.disciplinas, disciplina],
          };
        },
        async () => {
          await saveRemoteDisciplina(disciplina);
        },
      );
    },
    [commitData],
  );

  const deleteDisciplina = useCallback(
    (disciplinaId: string) => {
      commitData(
        (current) => {
          const itemIds = current.itensControle
            .filter((item) => item.disciplinaId === disciplinaId)
            .map((item) => item.id);

          return {
            ...current,
            disciplinas: current.disciplinas.filter((item) => item.id !== disciplinaId),
            itensControle: current.itensControle.filter(
              (item) => item.disciplinaId !== disciplinaId,
            ),
            pendencias: current.pendencias.filter((item) => item.disciplinaId !== disciplinaId),
            diarios: current.diarios.filter(
              (item) =>
                item.disciplinaId !== disciplinaId && !itemIds.includes(item.itemControleId),
            ),
          };
        },
        async () => {
          await deleteRemoteDisciplina(disciplinaId);
        },
      );
    },
    [commitData],
  );

  const saveItemControle = useCallback(
    (item: ItemControle) => {
      const normalized = { ...item, avancoFisico: clampPct(item.avancoFisico) };

      commitData(
        (current) => {
          const exists = current.itensControle.some(
            (currentItem) => currentItem.id === normalized.id,
          );
          return {
            ...current,
            itensControle: exists
              ? current.itensControle.map((currentItem) =>
                  currentItem.id === normalized.id ? normalized : currentItem,
                )
              : [...current.itensControle, normalized],
          };
        },
        async () => {
          await saveRemoteItemControle(normalized);
        },
      );
    },
    [commitData],
  );

  const deleteItemControle = useCallback(
    (itemId: string) => {
      commitData(
        (current) => ({
          ...current,
          itensControle: current.itensControle.filter((item) => item.id !== itemId),
          diarios: current.diarios.filter((item) => item.itemControleId !== itemId),
        }),
        async () => {
          await deleteRemoteItemControle(itemId);
        },
      );
    },
    [commitData],
  );

  const savePendencia = useCallback(
    (pendencia: Pendencia) => {
      commitData(
        (current) => {
          const exists = current.pendencias.some((item) => item.id === pendencia.id);
          return {
            ...current,
            pendencias: exists
              ? current.pendencias.map((item) => (item.id === pendencia.id ? pendencia : item))
              : [...current.pendencias, pendencia],
          };
        },
        async () => {
          await saveRemotePendencia(pendencia);
        },
      );
    },
    [commitData],
  );

  const deletePendencia = useCallback(
    (pendenciaId: string) => {
      commitData(
        (current) => ({
          ...current,
          pendencias: current.pendencias.filter((item) => item.id !== pendenciaId),
        }),
        async () => {
          await deleteRemotePendencia(pendenciaId);
        },
      );
    },
    [commitData],
  );

  const saveDiario = useCallback(
    (diario: Diario) => {
      const normalized = { ...diario, avancoItem: clampPct(diario.avancoItem) };

      commitData(
        (current) => {
          const exists = current.diarios.some((item) => item.id === normalized.id);

          return {
            ...current,
            diarios: exists
              ? current.diarios.map((item) => (item.id === normalized.id ? normalized : item))
              : [normalized, ...current.diarios],
            itensControle: current.itensControle.map((item) =>
              item.id === normalized.itemControleId
                ? {
                    ...item,
                    avancoFisico: normalized.avancoItem,
                    status: normalized.statusDia === "critico" ? "critico" : item.status,
                  }
                : item,
            ),
          };
        },
        async (nextData) => {
          await saveRemoteDiario(normalized);
          const updatedItem = nextData.itensControle.find(
            (item) => item.id === normalized.itemControleId,
          );
          if (updatedItem) await saveRemoteItemControle(updatedItem);
        },
      );
    },
    [commitData],
  );

  const deleteDiario = useCallback(
    (diarioId: string) => {
      commitData(
        (current) => ({
          ...current,
          diarios: current.diarios.filter((item) => item.id !== diarioId),
        }),
        async () => {
          await deleteRemoteDiario(diarioId);
        },
      );
    },
    [commitData],
  );

  const resetDemoData = useCallback(() => {
    commitData(() => demoData);
  }, [commitData]);

  const activeObra = data.obras.find((obra) => obra.id === data.activeObraId) ?? data.obras[0];

  const value = useMemo(
    () => ({
      data,
      activeObra,
      setActiveObra,
      saveObra,
      deleteObra,
      saveDisciplina,
      deleteDisciplina,
      saveItemControle,
      deleteItemControle,
      savePendencia,
      deletePendencia,
      saveDiario,
      deleteDiario,
      resetDemoData,
      persistenceMode,
      syncError,
    }),
    [
      activeObra,
      data,
      deleteDiario,
      deleteDisciplina,
      deleteItemControle,
      deleteObra,
      deletePendencia,
      resetDemoData,
      saveDiario,
      saveDisciplina,
      saveItemControle,
      saveObra,
      savePendencia,
      setActiveObra,
      persistenceMode,
      syncError,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function usePietraData() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("usePietraData must be used within PietraDataProvider");
  }

  return context;
}
