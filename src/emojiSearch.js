const shortcodePattern = /:([a-z0-9_+-]+)(: )?$/i;

export const findCompletedShortcode = (text, emoji) => {
  const match = shortcodePattern.exec(text);
  if (!match?.[2]) return null;

  const name = Object.keys(emoji).find(
    (candidate) => candidate.toLowerCase() === match[1].toLowerCase(),
  );
  if (!name) return null;

  return {
    emoji: emoji[name],
    start: text.length - match[0].length,
    end: text.length - 1,
  };
};

export const findSuggestions = (text, emoji) => {
  const token = shortcodePattern.exec(text);
  if (!token || token[2]) return null;

  const prefix = token[1].toLowerCase();
  return {
    range: { start: text.length - token[0].length, end: text.length },
    matches: Object.keys(emoji)
      .filter((name) => name.toLowerCase().startsWith(prefix))
      .slice(0, 30)
      .map((name) => ({ name, emoji: emoji[name] })),
  };
};
