import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/products/*.jpg', { eager: true });

const byName: Record<string, ImageMetadata> = {};
for (const [path, mod] of Object.entries(files)) {
  byName[path.split('/').pop()!] = mod.default;
}

export function productImage(name: string): ImageMetadata {
  const img = byName[name];
  if (!img) throw new Error(`Missing product image: ${name}`);
  return img;
}
