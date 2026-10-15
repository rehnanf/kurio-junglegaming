import * as Dialog from '@radix-ui/react-dialog';
import { Link, useNavigate } from '@tanstack/react-router';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { HomeContent } from '@/routes/index';

type AuthModalShellProps = {
  mode: 'login' | 'register';
  redirect?: string;
  description: string;
  children: ReactNode;
};

/**
 * Login/cadastro são rotas navegáveis, mas visualmente aparecem como modais
 * sobre a home REAL, exatamente como no Figma. O Dialog fornece foco preso,
 * Escape, clique no overlay e restauração de foco.
 */
export function AuthModalShell({ mode, redirect, description, children }: AuthModalShellProps) {
  const navigate = useNavigate();

  return (
    <>
      <div aria-hidden="true" className="pointer-events-none select-none" tabIndex={-1}>
        <HomeContent search={{}} />
      </div>
      <Dialog.Root
        open
        onOpenChange={(open) => {
          if (!open) navigate({ to: '/' });
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/35" />
          <Dialog.Content
            className="fixed left-1/2 top-[max(16px,7vh)] z-[80] max-h-[calc(100dvh-32px)] w-[calc(100vw-24px)] max-w-[450px] -translate-x-1/2 overflow-y-auto border border-[#3b2119] bg-[#241511] text-foreground shadow-[0_25px_80px_rgba(0,0,0,0.55)] outline-none sm:top-[8vh] sm:border-0"
            aria-describedby="auth-modal-description"
          >
            <Dialog.Title className="sr-only">
              {mode === 'login' ? 'Entrar na Kurio' : 'Criar conta na Kurio'}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={mode === 'login' ? 'Fechar login' : 'Fechar cadastro'}
                className="absolute right-3 top-3 z-10 rounded-md p-2 text-primary transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>

            <div className="px-6 pb-7 pt-12 sm:px-[70px] sm:pb-9 sm:pt-10">
              <div className="flex items-center justify-center gap-1 text-lg font-bold tracking-wide sm:text-xl">
                <Link
                  to="/login"
                  search={{ redirect }}
                  aria-current={mode === 'login' ? 'page' : undefined}
                  className={mode === 'login' ? 'text-primary' : 'text-foreground hover:text-primary'}
                >
                  Entrar
                </Link>
                <span className="font-normal text-muted-foreground">|</span>
                <Link
                  to="/register"
                  search={{ redirect }}
                  aria-current={mode === 'register' ? 'page' : undefined}
                  className={mode === 'register' ? 'text-primary' : 'text-foreground hover:text-primary'}
                >
                  Criar conta
                </Link>
              </div>
              <Dialog.Description
                id="auth-modal-description"
                className="mb-7 mt-8 text-center text-xs leading-relaxed text-foreground sm:mb-7 sm:mt-8"
              >
                {description}
              </Dialog.Description>
              {children}
            </div>
            <div className="h-1.5 bg-primary" aria-hidden="true" />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

/** O desafio não exige OAuth real; os provedores ficam visíveis e indisponíveis. */
export function AuthSocialButtons() {
  return (
    <>
      <div className="flex items-center gap-3 pt-2 text-[11px] text-foreground">
        <span className="h-px flex-1 bg-border" />
        Ou continue com
        <span className="h-px flex-1 bg-border" />
      </div>
      <button
        type="button"
        disabled
        title="Login com Google não está disponível nesta demonstração"
        className="flex h-10 w-full items-center justify-center gap-3 rounded-md border border-border text-xs text-muted-foreground opacity-80 disabled:cursor-not-allowed"
      >
        <span className="text-base font-extrabold" aria-hidden="true" style={{ color: '#4285F4' }}>G</span>
        Continuar com Google
      </button>
      <button
        type="button"
        disabled
        title="Login com Facebook não está disponível nesta demonstração"
        className="flex h-10 w-full items-center justify-center gap-3 rounded-md border border-border text-xs text-muted-foreground opacity-80 disabled:cursor-not-allowed"
      >
        <span className="text-xl font-extrabold text-[#4267B2]" aria-hidden="true">f</span>
        Continuar com Facebook
      </button>
    </>
  );
}
