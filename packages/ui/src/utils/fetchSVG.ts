import { createCacheFetch } from './createCacheFetch';

export async function fetchSVG(url: string) {
  if (!url) return '';
  const cacheFetch = await createCacheFetch('zane-svg');
  return await cacheFetch(url);
}
