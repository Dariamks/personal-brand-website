import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { readingTime } from "../../src/lib/readingTime";

describe("readingTime", () => {
  it("equals Math.ceil(zhChars/300 + enWords/200), minimum 1", () => {
    fc.assert(
      fc.property(
        fc.record({
          zhChars: fc.integer({ min: 0, max: 100000 }),
          enWords: fc.integer({ min: 0, max: 100000 }),
        }),
        ({ zhChars, enWords }) => {
          const result = readingTime(zhChars, enWords);
          const expected = Math.max(1, Math.ceil(zhChars / 300 + enWords / 200));
          expect(result).toBe(expected);
        }
      )
    );
  });

  it("always returns an integer >= 1", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100000 }),
        fc.integer({ min: 0, max: 100000 }),
        (zhChars, enWords) => {
          const result = readingTime(zhChars, enWords);
          expect(Number.isInteger(result)).toBe(true);
          expect(result).toBeGreaterThanOrEqual(1);
        }
      )
    );
  });

  it("is monotonic: adding chars or words never decreases reading time", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 50000 }),
        fc.integer({ min: 0, max: 50000 }),
        fc.integer({ min: 0, max: 1000 }),
        fc.integer({ min: 0, max: 1000 }),
        (zhChars, enWords, extraZh, extraEn) => {
          const base = readingTime(zhChars, enWords);
          const increased = readingTime(zhChars + extraZh, enWords + extraEn);
          expect(increased).toBeGreaterThanOrEqual(base);
        }
      )
    );
  });
});
