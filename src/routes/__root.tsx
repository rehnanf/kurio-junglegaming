import { Outlet, createRootRouteWithContext, Link } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { Home, Heart, ShoppingCart, UserRound } from 'lucide-react';
import type { QueryClient } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useSessionExpiredListener } from '@/hooks/use-session-expired-listener';
import { useNftGlobalSocket, useOrderGlobalSocket } from '@/hooks/use-socket';

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  notFoundComponent: NotFound,
});

function RootLayout() {
  useSessionExpiredListener();
  useNftGlobalSocket();
  useOrderGlobalSocket();
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <nav aria-label="Navegação inferior" className="fixed inset-x-0 bottom-0 z-40 flex h-[68px] items-center justify-around rounded-t-[22px] border-t border-border bg-[#24150f] px-4 shadow-2xl md:hidden">
        <Link to="/" aria-label="Início" className="rounded-lg p-3 text-primary"><Home className="h-5 w-5" /></Link>
        <Link to="/profile" aria-label="Favoritos e perfil" className="rounded-lg p-3 text-muted-foreground"><Heart className="h-5 w-5" /></Link>
        <Link to="/cart" aria-label="Carrinho" className="rounded-lg p-3 text-muted-foreground"><ShoppingCart className="h-5 w-5" /></Link>
        <Link to="/profile" aria-label="Meu perfil" className="rounded-lg p-3 text-muted-foreground"><UserRound className="h-5 w-5" /></Link>
      </nav>
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  );
}

function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-sm uppercase tracking-widest text-primary">404</p>
      <h1 className="font-display text-3xl font-bold">Página não encontrada</h1>
      <p className="text-muted-foreground">A rota acessada não existe ou foi movida.</p>
      <Link to="/" className="btn-primary">
        Voltar ao início
      </Link>
    </div>
  );
}