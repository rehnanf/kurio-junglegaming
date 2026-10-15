import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthModalShell, AuthSocialButtons } from '@/components/auth/auth-modal-shell';
import { useLogin } from '@/hooks/use-auth';
import { isApiError } from '@/api/client';

export const Route = createFileRoute('/login')({
  validateSearch: (search) => ({ redirect: typeof search.redirect === 'string' ? search.redirect : undefined }),
  component: LoginPage,
});

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('contato@mail.com');
  const [password, setPassword] = useState('123456');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const login = useLogin();
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    login.mutate(
      { email, password },
      {
        onSuccess: () => {
          toast.success('Bem-vindo de volta à Kurio.');
          navigate({ to: (redirect as never) ?? '/' });
        },
        onError: (err: unknown) => {
          if (isApiError(err) && err.fields) setErrors(err.fields);
          toast.error((err as { message?: string })?.message ?? 'Não foi possível autenticar.');
        },
      },
    );
  };

  return (
    <AuthModalShell
      mode="login"
      redirect={redirect}
      description="Entre para gerenciar sua carteira, coleção e perfil de criador."
    >
      <form className="space-y-3" onSubmit={onSubmit} noValidate>
        <div>
          <label className="sr-only" htmlFor="login-email">E-mail</label>
          <Input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="contato@email.com"
            autoComplete="email"
            required
            invalid={Boolean(errors.email)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
            className="h-10 border-[#44271e] bg-transparent text-xs placeholder:text-[#bb936a]"
          />
          {errors.email && <p id="login-email-error" role="alert" className="mt-1 text-xs text-destructive">{errors.email}</p>}
        </div>
        <div>
          <label className="sr-only" htmlFor="login-password">Senha</label>
          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="**********"
              autoComplete="current-password"
              required
              minLength={6}
              invalid={Boolean(errors.password)}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'login-password-error' : undefined}
              className="h-10 border-primary bg-transparent pr-10 text-xs"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[#bb936a] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p id="login-password-error" role="alert" className="mt-1 text-xs text-destructive">{errors.password}</p>}
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="text-xs text-primary hover:underline"
            onClick={() => toast.info('Recuperação de senha indisponível nesta demonstração.')}
          >
            Esqueceu a senha?
          </button>
        </div>
        <Button type="submit" className="mt-4 h-11 w-full text-sm" disabled={login.isPending}>
          {login.isPending ? 'Entrando…' : 'Entrar'}
        </Button>
        <AuthSocialButtons />
      </form>
    </AuthModalShell>
  );
}
