/**
 * Calculate estimated reading time in minutes.
 *
 * Chinese text is counted per-character (300 chars/min).
 * English text is counted per-word (200 words/min).
 * Returns at least 1 minute.
 */
export function readingTime(zhChars: number, enWords: number): number {
  return Math.max(1, Math.ceil(zhChars / 300 + enWords / 200));
}

/**
 * Estimate reading time from raw markdown/mdx body string.
 *
 * Separates Chinese characters (U+4E00–U+9FFF and U+3400–U+4DBF)
 * from the rest, then counts English words in the remainder.
 */
export function estimateFromMarkdown(body: string): number {
  // Count Chinese characters
  const chineseChars = (body.match(/[一-鿿㐀-䶿]/g) || []).length;
  // Remove Chinese chars, then count English words
  const withoutChinese = body.replace(/[一-鿿㐀-䶿]/g, " ");
  const englishWords = withoutChinese.split(/\s+/).filter(Boolean).length;
  return readingTime(chineseChars, englishWords);
}
