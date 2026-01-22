import { unstable_cache as unstableCache, revalidateTag } from "next/cache";

export interface ServerCacheOptions {
  revalidate?: number;
  tags?: string[];
}

// Wraps Next.js unstable_cache with a simple interface
export async function serverCached<T>(
  key: string[],
  fn: () => Promise<T>,
  options: ServerCacheOptions = {}
): Promise<T> {
  const cached = unstableCache(fn, key, {
    revalidate: options.revalidate ?? 300,
    tags: options.tags ?? key,
  });
  return cached();
}

// Re-export for convenience where invalidation is needed
export { revalidateTag };
