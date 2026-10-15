import { NftArt } from '@/components/nft/nft-art';

/** Visual-only home preview behind the desktop auth dialogs, as in the Figma screens. */
export function MarketplaceBackdrop() {
  const artworks = [
    'Emerald Ape #042', 'Sage Nomad #009', 'Neon Vessel #052',
    'Cosmic Bison #118', 'Golden Beat #207', 'Ivory Baron #088',
    'Violet Nomad #314', 'Golden Signal #160', 'Emerald Ape #042',
  ];
  return (
    <div aria-hidden="true" className="pointer-events-none hidden select-none lg:block">
      <div className="container grid grid-cols-[1.2fr_1fr] items-center gap-12 py-10">
        <div className="pl-4">
          <p className="text-xs tracking-widest">Bem-vindo à Kurio</p>
          <p className="mt-4 font-mono text-4xl font-extrabold uppercase leading-snug">SEJA DONO DO FUTURO<br />DA ARTE DIGITAL</p>
          <p className="mt-4 max-w-sm text-xs leading-relaxed text-muted-foreground">Descubra NFTs selecionados de criadores emergentes e consagrados. Colecione arte digital rara.</p>
          <span className="mt-5 inline-block rounded-sm bg-primary px-6 py-2 text-xs font-bold text-primary-foreground">EXPLORAR</span>
        </div>
        <NftArt seed="Emerald Ape #042" variant="feature" className="aspect-square w-full rounded-2xl" />
      </div>
      <div className="container grid grid-cols-[250px_1fr] gap-8">
        <aside className="rounded-md bg-card p-5 text-xs">
          <p className="mb-4 font-bold">Coleções</p>
          {['Arte digital', 'Fotografia', 'Música', 'Arte 3D', 'Colecionáveis', 'Generativa', 'Jogos', 'Assinaturas', 'Utilidade'].map((label, index) => (
            <p key={label} className="flex justify-between py-2 text-primary"><span>{label}</span><span>({[33,12,65,39,23,17,19,13,18][index]})</span></p>
          ))}
          <p className="mt-7 font-bold">Faixa de preço</p>
          <div className="mt-4 h-1 rounded-full bg-primary" />
          <p className="mt-6 font-bold">Rede</p>
          <p className="mt-3 text-primary">Ethereum · Polygon · Solana</p>
        </aside>
        <div>
          <p className="mb-4 text-xs text-primary">
            Todos os NFTs · Novos lançamentos · Em alta
          </p>
          <div className="grid grid-cols-3 gap-x-4 gap-y-7">
            {artworks.map((art, index) => (
              <div key={`${art}-${index}`}>
                <NftArt seed={art} className="aspect-square w-full rounded-xl" />
                <p className="mt-2 text-xs">{art}</p>
                <p className="text-xs font-bold text-primary">{(1.19 + index * 0.1).toFixed(2)} ETH</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
