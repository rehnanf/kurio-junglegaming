import { Link } from '@tanstack/react-router';
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import { toast } from 'sonner';
import { Logo } from '@/components/ui/logo';

const features = [
  {
    initial: 'W',
    title: 'Segurança da carteira',
    description: 'Proteja sua carteira e colecione arte digital verificada com confiança.',
  },
  {
    initial: 'C',
    title: 'Criadores em destaque',
    description: 'Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.',
  },
  {
    initial: 'D',
    title: 'Alertas de lançamentos',
    description: 'Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.',
  },
];

export function Footer() {
  return (
    <footer className="mt-10 pb-5 text-[13px]">
      <div className="container bg-card">
        <div className="grid gap-7 px-6 py-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:px-8 lg:py-8">
          {features.map((feature) => (
            <div key={feature.initial} className="lg:min-h-[190px] lg:border-r lg:border-primary/70 lg:px-4 first:lg:pl-0">
              <div className="mb-3 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                {feature.initial}
              </div>
              <h2 className="mb-2 text-[16px] font-bold leading-tight text-foreground">{feature.title}</h2>
              <p className="max-w-[220px] text-[13px] leading-[1.6] text-muted-foreground">{feature.description}</p>
            </div>
          ))}
          <div className="lg:pl-4">
            <h2 className="mb-4 max-w-[230px] text-[16px] font-bold leading-tight text-foreground">Antecipe-se ao próximo lançamento</h2>
            <form
              className="flex max-w-[300px]"
              onSubmit={(event) => {
                event.preventDefault();
                toast.info('Alertas de lançamento estarão disponíveis em breve.');
              }}
            >
              <input
                aria-label="Seu e-mail para receber novidades"
                type="email"
                required
                placeholder="digite seu e-mail..."
                className="h-10 min-w-0 flex-1 rounded-l-md bg-[#38200D] px-3 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
              <button type="submit" className="h-10 rounded-r-md bg-primary px-4 font-bold text-primary-foreground hover:bg-primary/90">
                Enviar
              </button>
            </form>
            <p className="mt-3 max-w-[300px] text-[12px] leading-[1.6] text-muted-foreground">
              Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
            </p>
          </div>
        </div>

        <div className="grid gap-5 bg-[#38200D] px-6 py-5 text-[12px] md:grid-cols-4 md:items-center lg:px-8">
          <Logo className="text-[13px]" />
          <p className="max-w-[210px]">Feito para colecionadores, criadores e cultura</p>
          <a href="mailto:contato@email.com" className="hover:text-primary">contato@email.com</a>
          <a href="tel:+551140028922" className="hover:text-primary">+55 11 4002 8922</a>
        </div>

        <div className="grid gap-8 px-6 py-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6 lg:px-8 lg:py-9">
          <FooterColumn title="Meu perfil" items={[
            { text: 'Meu perfil', href: '/profile' },
            { text: 'Minha coleção', href: '/profile' },
            { text: 'Atividade', href: '/profile' },
            { text: 'Estúdio do criador', href: '/profile' },
            { text: 'Lista de interesse', href: '/profile' },
          ]} />
          <FooterColumn title="Central de ajuda" items={[
            { text: 'Central de ajuda' },
            { text: 'Como comprar NFTs' },
            { text: 'Carteira e segurança' },
            { text: 'Política do mercado' },
            { text: 'Denunciar item' },
          ]} />
          <FooterColumn title="Coleções" items={[
            { text: 'Arte digital', href: '/' },
            { text: 'Fotografia', href: '/' },
            { text: 'Música', href: '/' },
            { text: 'Arte 3D', href: '/' },
            { text: 'Utilidade', href: '/' },
          ]} />
          <div>
            <h2 className="mb-3 text-[16px] font-bold">Redes sociais</h2>
            <div className="flex flex-wrap gap-2">
              {[Facebook, Instagram, Twitter, Linkedin, Youtube].map((Icon, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toast.info('Redes sociais da Kurio estarão disponíveis em breve.')}
                  aria-label={['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'YouTube'][i]}
                  className="flex h-7 w-7 items-center justify-center rounded border border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
            <h2 className="mb-3 mt-6 text-[16px] font-bold">Carteiras compatíveis</h2>
            <p className="inline-block rounded border border-primary/20 bg-[#38200D] px-2 py-1 text-[9px] font-bold uppercase text-primary">
              MetaMask · WalletConnect · Coinbase
            </p>
          </div>
        </div>
      </div>
      <p className="container pt-3 text-center text-[12px] text-foreground">© 2026 Kurio. Propriedade digital para todos.</p>
    </footer>
  );
}

function FooterColumn({ title, items }: { title: string; items: { text: string; href?: '/' | '/profile' }[] }) {
  return (
    <div>
      <h2 className="mb-3 text-[16px] font-bold">{title}</h2>
      <ul className="space-y-2.5 text-[13px]">
        {items.map((item) => (
          <li key={item.text}>
            {item.href ? (
              <Link to={item.href} className="hover:text-primary">{item.text}</Link>
            ) : (
              <span>{item.text}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
