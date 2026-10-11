import { describe, expect, it } from "vitest";
import { findCompletedShortcode, findSuggestions } from "./emojiSearch.js";
import emoji from "./emoji.test-fixtures.js";

describe("emojiSearch", () => {
  it("finds suggestions case-insensitively and returns the shortcode range", () => {
    const text = "hello :Do";

    expect(findSuggestions(text, emoji)).toEqual({
      range: { start: 6, end: text.length },
      matches: [
        { name: "dog", emoji: emoji.dog },
        { name: "dog2", emoji: emoji.dog2 },
        { name: "dolphin", emoji: emoji.dolphin },
      ],
    });
  });

  it("returns no suggestions when the caret is not after a shortcode", () => {
    expect(findSuggestions("hello", emoji)).toBeNull();
  });

  it("limits suggestions to 30 entries", () => {
    const manyEmoji = Object.fromEntries(
      Array.from({ length: 31 }, (_, index) => [`dog_${index}`, "🐶"]),
    );

    expect(findSuggestions(":dog", manyEmoji).matches).toHaveLength(30);
  });

  it("finds completed shortcodes case-insensitively and returns the replacement range", () => {
    const text = "Say :CAT: ";

    expect(findCompletedShortcode(text, emoji)).toEqual({
      emoji: emoji.cat,
      start: 4,
      end: text.length - 1,
    });
  });

  it("ignores unknown completed shortcodes", () => {
    expect(findCompletedShortcode("Say :unknown: ", emoji)).toBeNull();
  });
});
