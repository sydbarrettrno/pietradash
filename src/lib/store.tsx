/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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

const STORAGE_KEY = "pietra.dashboard.data.v1";

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
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setData(normalizeData(JSON.parse(raw)));
      } catch {
        setData(demoData);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, hydrated]);

  const setActiveObra = useCallback((obraId: string) => {
    setData((current) =>
      current.obras.some((obra) => obra.id === obraId)
        ? touch({ ...current, activeObraId: obraId })
        : current,
    );
  }, []);

  const saveObra = useCallback((obra: Obra) => {
    setData((current) => {
      const exists = current.obras.some((item) => item.id === obra.id);
      return touch({
        ...current,
        activeObraId: current.activeObraId || obra.id,
        obras: exists
          ? current.obras.map((item) => (item.id === obra.id ? obra : item))
          : [...current.obras, obra],
      });
    });
  }, []);

  const deleteObra = useCallback((obraId: string) => {
    setData((current) => {
      if (current.obras.length <= 1) return current;
      const obras = current.obras.filter((obra) => obra.id !== obraId);
      const activeObraId = current.activeObraId === obraId ? obras[0].id : current.activeObraId;

      return touch({
        ...current,
        activeObraId,
        obras,
        disciplinas: current.disciplinas.filter((item) => item.obraId !== obraId),
        itensControle: current.itensControle.filter((item) => item.obraId !== obraId),
        pendencias: current.pendencias.filter((item) => item.obraId !== obraId),
        diarios: current.diarios.filter((item) => item.obraId !== obraId),
      });
    });
  }, []);

  const saveDisciplina = useCallback((disciplina: Disciplina) => {
    setData((current) => {
      const exists = current.disciplinas.some((item) => item.id === disciplina.id);
      return touch({
        ...current,
        disciplinas: exists
          ? current.disciplinas.map((item) => (item.id === disciplina.id ? disciplina : item))
          : [...current.disciplinas, disciplina],
      });
    });
  }, []);

  const deleteDisciplina = useCallback((disciplinaId: string) => {
    setData((current) => {
      const itemIds = current.itensControle
        .filter((item) => item.disciplinaId === disciplinaId)
        .map((item) => item.id);

      return touch({
        ...current,
        disciplinas: current.disciplinas.filter((item) => item.id !== disciplinaId),
        itensControle: current.itensControle.filter((item) => item.disciplinaId !== disciplinaId),
        pendencias: current.pendencias.filter((item) => item.disciplinaId !== disciplinaId),
        diarios: current.diarios.filter(
          (item) => item.disciplinaId !== disciplinaId && !itemIds.includes(item.itemControleId),
        ),
      });
    });
  }, []);

  const saveItemControle = useCallback((item: ItemControle) => {
    const normalized = { ...item, avancoFisico: clampPct(item.avancoFisico) };

    setData((current) => {
      const exists = current.itensControle.some((currentItem) => currentItem.id === normalized.id);
      return touch({
        ...current,
        itensControle: exists
          ? current.itensControle.map((currentItem) =>
              currentItem.id === normalized.id ? normalized : currentItem,
            )
          : [...current.itensControle, normalized],
      });
    });
  }, []);

  const deleteItemControle = useCallback((itemId: string) => {
    setData((current) =>
      touch({
        ...current,
        itensControle: current.itensControle.filter((item) => item.id !== itemId),
        diarios: current.diarios.filter((item) => item.itemControleId !== itemId),
      }),
    );
  }, []);

  const savePendencia = useCallback((pendencia: Pendencia) => {
    setData((current) => {
      const exists = current.pendencias.some((item) => item.id === pendencia.id);
      return touch({
        ...current,
        pendencias: exists
          ? current.pendencias.map((item) => (item.id === pendencia.id ? pendencia : item))
          : [...current.pendencias, pendencia],
      });
    });
  }, []);

  const deletePendencia = useCallback((pendenciaId: string) => {
    setData((current) =>
      touch({
        ...current,
        pendencias: current.pendencias.filter((item) => item.id !== pendenciaId),
      }),
    );
  }, []);

  const saveDiario = useCallback((diario: Diario) => {
    const normalized = { ...diario, avancoItem: clampPct(diario.avancoItem) };

    setData((current) => {
      const exists = current.diarios.some((item) => item.id === normalized.id);

      return touch({
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
      });
    });
  }, []);

  const deleteDiario = useCallback((diarioId: string) => {
    setData((current) =>
      touch({
        ...current,
        diarios: current.diarios.filter((item) => item.id !== diarioId),
      }),
    );
  }, []);

  const resetDemoData = useCallback(() => {
    setData(demoData);
  }, []);

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
