import LZString from "lz-string";

export type ShareFormat = "markdown" | "html";

const EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export function encodeContent(content: string): string {
  return LZString.compressToEncodedURIComponent(content);
}

export function decodeContent(encoded: string): string {
  return LZString.decompressFromEncodedURIComponent(encoded) ?? "";
}

export function isLinkExpired(expiresAt: number | null): boolean {
  return expiresAt !== null && Date.now() > expiresAt;
}

export function buildShareUrl(
  origin: string,
  content: string,
  format: ShareFormat,
  publisher?: string
): string {
  const url = new URL("/share", origin);
  url.searchParams.set("c", encodeContent(content));
  url.searchParams.set("f", format);
  url.searchParams.set("exp", String(Date.now() + EXPIRY_MS));
  if (publisher?.trim()) {
    url.searchParams.set("p", publisher.trim());
  }
  return url.toString();
}
