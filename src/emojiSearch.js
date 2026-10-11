export const findCompletedShortcode = (text, emoji) => {
  const match = /:([a-z0-9_+-]+): $/i.exec(text);
  if (!match) return null;

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
  const token = /:([a-z0-9_+-]+)$/i.exec(text);
  if (!token) return null;

  const prefix = token[1].toLowerCase();
  return {
    range: { start: text.length - token[0].length, end: text.length },
    matches: Object.keys(emoji)
      .filter((name) => name.toLowerCase().startsWith(prefix))
      .slice(0, 30)
      .map((name) => ({ name, emoji: emoji[name] })),
  };
};
