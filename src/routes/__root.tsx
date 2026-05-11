import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 text-center">
      <div className="max-w-md space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="space-y-4">
          <span className="caption text-leaf">404</span>
          <h1 className="display-lg italic text-ink">Território não encontrado.</h1>
          <p className="serif-lead text-ink-2">
            Este caminho ainda não foi traçado ou se perdeu no tempo.
          </p>
        </div>
        <div className="pt-8">
          <Link
            to="/"
            className="caption px-10 py-4 bg-ink text-paper hover:bg-oxblood transition-colors inline-block"
          >
            Retornar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 text-center">
      <div className="max-w-md space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="space-y-4">
          <span className="caption text-oxblood">Erro</span>
          <h1 className="display-lg italic text-ink">A travessia foi interrompida.</h1>
          <p className="serif-lead text-ink-2">
            Houve um ruído na comunicação. Tente recomeçar sua jornada.
          </p>
        </div>
        <div className="pt-8 flex flex-col items-center gap-6">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="caption px-10 py-4 bg-ink text-paper hover:bg-oxblood transition-colors"
          >
            Tentar novamente
          </button>
          <Link to="/" className="caption text-ink-3 hover:text-ink transition-colors">
            Retornar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Casa Orácula — A voz da sua psique" },
      { name: "description", content: "Portal de autoconhecimento profundo através de arquétipos e travessias sonoras." },
      { name: "author", content: "Casa Orácula" },
      { property: "og:title", content: "Casa Orácula — A voz da sua psique" },
      { property: "og:description", content: "Portal de autoconhecimento profundo através de arquétipos e travessias sonoras." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
