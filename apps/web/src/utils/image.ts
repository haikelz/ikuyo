// ImageKit resizes and re-encodes on request; other hosts get the original URL.
export function optimizeUrl(url: string, width: number, quality = 85) {
  if (!url.includes("imagekit.io")) return url;
  return `${url.split("?")[0]}?tr=f-auto,q-${quality},w-${width}`;
}

export function getPlaceholderUrl(url: string, width = 40) {
  return optimizeUrl(url, width, 20);
}
