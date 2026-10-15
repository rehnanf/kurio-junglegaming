/** Portrait selection for the four original 1254×1254 Figma-embedded NFT portraits, optimized to WebP. */
export function getNftArtworkUrl(seed: string): string {
  const value = seed.toLowerCase();
  if (/emerald|nft-042/.test(value)) return '/assets/kurio-green.webp';
  if (/sage|cosmic|violet|nomad|bison/.test(value)) return '/assets/kurio-gray.webp';
  if (/neon|ivory|baron|vessel|crimson|steel|smoke|titan/.test(value)) return '/assets/kurio-black.webp';
  return '/assets/kurio-gold.webp';
}
