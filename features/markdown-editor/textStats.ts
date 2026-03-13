export interface TextStats {
  characters: number;
  words: number;
  paragraphs: number;
}

export function getTextStats(value: string): TextStats {
  const normalizedValue = value.replace(/\r\n/g, "\n");
  const trimmedValue = normalizedValue.trim();
  const words = normalizedValue.match(/\S+/g)?.length ?? 0;
  const paragraphs = trimmedValue
    ? trimmedValue.split(/\n\s*\n+/).filter((paragraph) => paragraph.trim().length > 0).length
    : 0;

  return {
    characters: value.length,
    words,
    paragraphs,
  };
}

export function stripHtmlTags(value: string): string {
  return value
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}