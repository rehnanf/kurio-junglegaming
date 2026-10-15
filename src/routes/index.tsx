import { createFileRoute, Link as RouterLink, useNavigate } from '@tanstack/react-router';
import { ArrowRight, Search, SlidersHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CatalogFilters, CatalogPagination, CatalogToolbar } from '@/components/catalog/catalog-filters';
import { NftCard } from '@/components/nft/nft-card';
import { NftArt } from '@/components/nft/nft-art';
import { useNftList } from '@/hooks/use-nfts';
import { buildListQuery, catalogSearchSchema, type CatalogSearchParams } from '@/api/search-params';

export const Route = createFileRoute('/')({
  validateSearch: catalogSearchSchema,
  component: HomePage,
});

function HomePage() {
  const search = Route.useSearch();
  return <HomeContent search={search} />;
}

/** O mesmo catálogo real aparece ao fundo dos modais de autenticação. */
export function HomeContent({ search }: { search: CatalogSearchParams }) {
  const navigate = useNavigate({ from: '/' });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches,
  );
  useEffect(() => {
    const media = window.matchMedia('(max-width: 1023px)');
    const sync = () => setIsMobile(media.matches);
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);
  const { data, isLoading, isError, isFetching } = useNftList(buildListQuery(search));

  return (
    <>
      {/* The mobile reference places a compact search field before the hero. */}
      {isMobile && (
        <section className="container pt-5 lg:hidden">
          <form
            role="search"
            className="flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              const query = new FormData(event.currentTarget).get('mobile-search');
              navigate({ search: (prev) => ({ ...prev, q: String(query ?? ''), page: 1 }) });
            }}
          >
            <label className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
              <span className="sr-only">Explorar coleções</span>
              <input
                name="mobile-search"
                defaultValue={search.q ?? ''}
                placeholder="Nome ou coleção"
                className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-3 text-xs text-foreground placeholder:text-muted-foreground"
              />
            </label>
            <button
              type="button"
              aria-label="Exibir filtros"
              aria-expanded={mobileFiltersOpen}
              onClick={() => {
                setMobileFiltersOpen((open) => !open);
                document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </form>
        </section>
      )}

      <section className="container pt-6 lg:pt-8">
        <div className="grid items-center gap-6 lg:min-h-[450px] lg:grid-cols-[minmax(0,1fr)_minmax(300px,450px)] lg:gap-10 xl:gap-[70px] 2xl:gap-[110px]">
          <div className="relative min-h-[235px] overflow-hidden rounded-2xl bg-gradient-to-br from-[#503019] via-[#2d1a11] to-[#1a100d] px-5 py-6 lg:min-h-0 lg:overflow-visible lg:rounded-none lg:bg-none lg:pl-10 lg:pr-0 lg:py-0">
            <div className="relative z-10 w-[62%] lg:w-full">
              <p className="text-[10px] tracking-[0.10em] text-foreground lg:text-sm">Bem-vindo à Kurio</p>
              <h1 className="mt-2 text-[21px] font-bold uppercase leading-[1.35] tracking-normal text-foreground sm:text-[27px] lg:mt-3 lg:text-[39px] lg:leading-[1.55] xl:text-[43px]">
                Seja dono do futuro da arte digital
              </h1>
              <p className="mt-3 max-w-[560px] text-[11px] leading-[1.55] text-muted-foreground sm:text-xs lg:mt-3 lg:text-sm lg:leading-[24px]">
                Descubra NFTs selecionados de criadores emergentes e consagrados. Colecione arte digital rara, apoie artistas e tenha sua parte da cultura digital.
              </p>
              <div className="mt-4 flex items-center gap-3 lg:mt-6">
                <Button
                  variant="primary"
                  size="sm"
                  className="h-8 rounded-md px-4 text-[10px] lg:h-10 lg:min-w-[140px] lg:px-6 lg:text-base"
                  onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explorar <ArrowRight className="h-3.5 w-3.5 lg:hidden" />
                </Button>
              </div>
              <div className="mt-5 flex gap-2 lg:mt-11 lg:justify-end" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <span key={i} className={`h-2 w-2 rounded-full ${i === 0 ? 'bg-primary' : 'bg-primary/70'}`} />
                ))}
              </div>
            </div>
            <div className="absolute right-2 top-1/2 h-[185px] w-[42%] -translate-y-1/2 overflow-hidden rounded-2xl lg:hidden">
              <NftArt seed="Emerald Ape #042" variant="feature" className="h-full w-full" />
            </div>
          </div>
          <RouterLink
            to="/nft/$id"
            params={{ id: 'nft-042-0' }}
            className="hidden aspect-square w-full max-w-[450px] overflow-hidden rounded-[24px] lg:block"
            aria-label="Ver Emerald Ape em destaque"
          >
            <NftArt seed="Emerald Ape #042" variant="feature" className="h-full w-full" />
          </RouterLink>
        </div>
      </section>

      <section id="catalog" className="container scroll-mt-20 pt-8 pb-12 lg:pt-24">
        <div className="grid gap-5 lg:grid-cols-[310px_minmax(0,1fr)] lg:gap-12">
          <div className={mobileFiltersOpen ? 'block' : 'hidden lg:block'}>
            <CatalogFilters search={search} showSearch={!isMobile} />
            <div className="mt-6 hidden bg-card p-3 lg:block">
              <h2 className="mb-2 text-lg font-bold uppercase text-primary">NFT em destaque</h2>
              <p className="mb-3 text-right text-sm font-bold">OFERTA LIMITADA</p>
              <RouterLink to="/nft/$id" params={{ id: 'nft-043-1' }} aria-label="Ver NFT em destaque">
                <NftArt seed="Sage Nomad #009" className="aspect-square w-full rounded-[18px]" />
              </RouterLink>
            </div>
          </div>

          <div className="min-w-0">
            <CatalogToolbar search={search} />
            {isLoading && <CatalogSkeleton />}
            {isError && (
              <div role="alert" className="border border-destructive/40 bg-card p-8 text-center">
                <p className="text-lg font-bold">Não foi possível carregar o catálogo.</p>
                <p className="mt-2 text-sm text-muted-foreground">Verifique sua conexão e tente novamente.</p>
              </div>
            )}
            {data && data.data.length === 0 && !isLoading && (
              <div className="border border-border bg-card p-12 text-center">
                <p className="text-lg font-bold">Nenhum NFT encontrado.</p>
                <p className="mt-2 text-sm text-muted-foreground">Ajuste os filtros ou explore outras coleções.</p>
              </div>
            )}
            {data && data.data.length > 0 && (
              <>
                <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-10 xl:grid-cols-3">
                  {data.data.map((nft) => <NftCard key={nft.id} nft={nft} />)}
                </div>
                <CatalogPagination search={search} total={data.meta.total} pageSize={data.meta.pageSize} />
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Mostrando {data.data.length} de {data.meta.total} NFTs
                  {isFetching && !isLoading && ' · atualizando…'}
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="container pb-10 lg:hidden">
        <h2 className="mb-4 text-lg font-bold uppercase text-primary">NFT em destaque</h2>
        <RouterLink to="/nft/$id" params={{ id: 'nft-043-1' }} className="block max-w-[360px] bg-card p-3">
          <NftArt seed="Sage Nomad #009" className="aspect-square w-full rounded-xl" />
          <span className="mt-2 block text-sm font-bold text-primary">OFERTA LIMITADA</span>
        </RouterLink>
      </section>

      <section className="container grid gap-6 pb-20 md:grid-cols-2">
        <EditorialBanner
          title="Lançamentos gênesis de edição limitada"
          description="Colecione edições escassas diretamente dos criadores antes da revelação pública."
          art="Emerald Ape #042"
        />
        <EditorialBanner
          title="Arte digital selecionada e muito mais"
          description="Explore novos artistas, coleções verificadas e obras digitais que definem a cultura."
          art="Neon Vessel #052"
        />
      </section>

      <section className="container pb-20">
        <div className="mb-7 text-center">
          <h2 className="text-2xl font-bold">Diário da Cunhagem</h2>
          <p className="mt-2 text-sm text-muted-foreground">Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { art: 'Neon Vessel #052', title: 'Como funciona a propriedade de NFTs', description: 'Aprenda a colecionar, negociar e verificar ativos digitais.' },
            { art: 'Emerald Ape #042', title: '10 artistas digitais para acompanhar', description: 'Conheça criadores que moldam a cultura digital.' },
            { art: 'Sage Nomad #009', title: 'Raridade, atributos e procedência', description: 'Entenda raridade, procedência, direitos autorais e utilidade.' },
            { art: 'Golden Beat #207', title: 'Como proteger sua carteira', description: 'Proteja seus ativos, suas chaves e sua identidade.' },
          ].map((story) => (
            <article key={story.title} className="overflow-hidden rounded-md bg-card">
              <NftArt seed={story.art} className="aspect-[1.4] w-full object-cover" />
              <div className="px-4 pb-4 pt-3">
                <p className="text-[10px] text-muted-foreground">15 de setembro | Leitura de 3 min</p>
                <h3 className="mt-2 text-[15px] font-bold leading-snug">{story.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{story.description}</p>
                <RouterLink to="/" className="mt-2 inline-block text-xs font-bold text-primary hover:underline">Explorar NFTs →</RouterLink>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-5 lg:grid-cols-3" aria-busy="true">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="bg-card p-3"><Skeleton className="aspect-square w-full rounded-lg" /></div>
      ))}
    </div>
  );
}

function EditorialBanner({ title, description, art }: { title: string; description: string; art: string }) {
  return (
    <div className="flex min-h-[185px] overflow-hidden rounded-md bg-card">
      <NftArt seed={art} className="aspect-square w-[44%] shrink-0 object-cover" />
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-4 text-center">
        <h2 className="max-w-[210px] text-sm font-bold leading-snug">{title}</h2>
        <p className="max-w-[250px] text-xs leading-relaxed text-muted-foreground">{description}</p>
        <RouterLink to="/" className="rounded-md bg-primary px-5 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90">
          Explorar →
        </RouterLink>
      </div>
    </div>
  );
}
