import { getNftArtworkUrl } from '@/lib/nft-artwork';

/**
 * NFT artworks referenced by the Figma screens.
 * Images are bundled locally so the visual mock is deterministic and offline-friendly.
 * The source design provides four distinct portraits; other mock NFTs reuse them.
 */
export interface NftArtOptions {
  seed: string;
  variant?: 'default' | 'feature';
  className?: string;
}


export function NftArt({ seed, variant = 'default', className }: NftArtOptions) {
  return (
    <img
      src={getNftArtworkUrl(seed)}
      alt={`Arte digital: ${seed}`}
      className={`block object-cover ${className ?? ''}`}
      loading={variant === 'feature' ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}
