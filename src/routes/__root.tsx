import { createRootRoute, Outlet, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { AppShell } from "@/components/AppShell";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Painel Pietra — Gestão de Obra" },
      { name: "description", content: "Sistema executivo de gestão e controle da obra Bella Pietra." },
      { property: "og:title", content: "Painel Pietra — Gestão de Obra" },
      { name: "twitter:title", content: "Painel Pietra — Gestão de Obra" },
      { property: "og:description", content: "Sistema executivo de gestão e controle da obra Bella Pietra." },
      { name: "twitter:description", content: "Sistema executivo de gestão e controle da obra Bella Pietra." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/17a6d395-e3e9-42eb-b29f-2187f0a53a0b/id-preview-b48e70a2--aec94d77-8478-4950-a849-d9165c864e5f.lovable.app-1777617289543.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/17a6d395-e3e9-42eb-b29f-2187f0a53a0b/id-preview-b48e70a2--aec94d77-8478-4950-a849-d9165c864e5f.lovable.app-1777617289543.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: () => (
    <AppShell />
  ),
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">Página não encontrada.</p>
        <a href="/" className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Voltar ao painel</a>
      </div>
    </div>
  ),
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

// Outlet rendered inside AppShell
export { Outlet };
