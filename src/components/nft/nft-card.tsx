import { Link } from '@tanstack/react-router';
import { Heart } from 'lucide-react';
import { useToggleFavorite, useFavorites } from '@/hooks/use-favorites';
import { NftArt } from '@/components/nft/nft-art';
import { RarityOrFeaturedBadge } from '@/components/nft/badges';
import { formatEthValue } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Nft } from '@/types';

interface NftCardProps {
  nft: Nft;
  compact?: boolean;
  className?: string;
}

export function NftCard({ nft, compact, className }: NftCardProps) {
  const favorites = useFavorites();
  const toggle = useToggleFavorite();
  const isFav = favorites.data?.some((f) => f.nftId === nft.id) ?? false;

  const onFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle.mutate({ nftId: nft.id, action: isFav ? 'remove' : 'add' });
  };

  return (
    <Link
      to="/nft/$id"
      params={{ id: nft.id }}
      className={cn(
        'kurio-nft-card group relative block min-w-0 overflow-hidden bg-transparent',
        className,
      )}
      aria-label={`${nft.name}, ${formatEthValue(nft.price.amount)} ETH`}
    >
      <div className={cn('relative overflow-hidden bg-card', compact ? 'aspect-square' : 'aspect-square')}>
        <NftArt seed={nft.name} className="kurio-nft-card-image absolute inset-[12px] h-[calc(100%-24px)] w-[calc(100%-24px)] rounded-xl" />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          <RarityOrFeaturedBadge nft={nft} />
        </div>
        <button
          type="button"
          aria-label={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          aria-pressed={isFav}
          onClick={onFav}
          className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-background/75 text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Heart className={cn('h-4 w-4', isFav && 'fill-primary text-primary')} />
        </button>

      </div>
      <div className="space-y-0.5 pb-1 pt-2">
        <p className="truncate text-[13px] font-medium text-foreground sm:text-sm">{nft.name}</p>
        <p className="font-mono text-[13px] font-bold text-primary sm:text-sm">{formatEthValue(nft.price.amount)} ETH</p>
      </div>
    </Link>
  );
}