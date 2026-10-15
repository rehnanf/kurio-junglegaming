import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthModalShell, AuthSocialButtons } from '@/components/auth/auth-modal-shell';
import { useRegister } from '@/hooks/use-auth';
import { isApiError } from '@/api/client';

export const Route = createFileRoute('/register')({
  validateSearch: (search) => ({ redirect: typeof search.redirect === 'string' ? search.redirect : undefined }),
  component: RegisterPage,
});

function RegisterPage() {
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmError, setConfirmError] = useState<string | undefined>();
  const register = useRegister();
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setConfirmError(undefined);
    if (password !== confirm) {
      setConfirmError('As senhas precisam coincidir.');
      return;
    }
    register.mutate(
      { displayName, username, email, password },
      {
        onSuccess: () => {
          toast.success('Conta criada! Bem-vindo à Kurio.');
          navigate({ to: (redirect as never) ?? '/' });
        },
        onError: (err: unknown) => {
          if (isApiError(err) && err.fields) setErrors(err.fields);
          toast.error((err as { message?: string })?.message ?? 'Falha no cadastro.');
        },
      },
    );
  };

  const fieldClass = 'h-10 border-[#44271e] bg-transparent text-xs placeholder:text-[#bb936a]';

  return (
    <AuthModalShell
      mode="register"
      redirect={redirect}
      description="Crie seu perfil de colecionador e conecte uma carteira quando quiser."
    >
      <form className="space-y-2.5" onSubmit={onSubmit} noValidate>
        <div>
          <label htmlFor="reg-display" className="sr-only">Nome de exibição</label>
          <Input
            id="reg-display"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Nome de exibição"
            autoComplete="name"
            required
            invalid={Boolean(errors.displayName)}
            className={fieldClass}
          />
          {errors.displayName && <p role="alert" className="mt-1 text-xs text-destructive">{errors.displayName}</p>}
        </div>
        <div>
          <label htmlFor="reg-username" className="sr-only">Nome de usuário</label>
          <Input
            id="reg-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nome de usuário"
            autoComplete="username"
            required
            minLength={3}
            invalid={Boolean(errors.username)}
            className={fieldClass}
          />
          {errors.username && <p role="alert" className="mt-1 text-xs text-destructive">{errors.username}</p>}
        </div>
        <div>
          <label htmlFor="reg-email" className="sr-only">E-mail</label>
          <Input
            id="reg-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu e-mail"
            autoComplete="email"
            required
            invalid={Boolean(errors.email)}
            className={fieldClass}
          />
          {errors.email && <p role="alert" className="mt-1 text-xs text-destructive">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="reg-password" className="sr-only">Senha</label>
          <div className="relative">
            <Input
              id="reg-password"
              type={showPwd ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              autoComplete="new-password"
              minLength={6}
              required
              invalid={Boolean(errors.password)}
              className={`${fieldClass} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPwd((value) => !value)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[#bb936a] focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={showPwd ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p role="alert" className="mt-1 text-xs text-destructive">{errors.password}</p>}
        </div>
        <div>
          <label htmlFor="reg-confirm" className="sr-only">Confirmar senha</label>
          <div className="relative">
            <Input
              id="reg-confirm"
              type={showConfirm ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirmar senha"
              autoComplete="new-password"
              minLength={6}
              required
              invalid={Boolean(confirmError ?? errors.confirm)}
              className={`${fieldClass} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((value) => !value)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[#bb936a] focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={showConfirm ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {(confirmError ?? errors.confirm) && <p role="alert" className="mt-1 text-xs text-destructive">{confirmError ?? errors.confirm}</p>}
        </div>
        <Button type="submit" className="mt-3 h-11 w-full text-sm" disabled={register.isPending}>
          {register.isPending ? 'Criando…' : 'Criar conta'}
        </Button>
        <AuthSocialButtons />
      </form>
    </AuthModalShell>
  );
}
