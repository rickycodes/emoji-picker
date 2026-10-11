import createLink from "./createLink.js";
import clearElement from "./clearElement.js";
import keyboardNavigation from "./keyboardNavigation.js";
import setAttributes from "./setAttributes.js";

let instanceCount = 0;

export default (selector, emoji) => {
  const input = document.querySelector(selector);
  if (!input) throw new Error(`Emoji picker input not found: ${selector}`);

  const picker = document.createElement("div");
  picker.className = "picker";
  picker.id = input.id
    ? `${input.id}-suggestions`
    : `emoji-picker-${++instanceCount}-suggestions`;
  setAttributes(picker, {
    role: "listbox",
    "aria-label": "Emoji suggestions",
  });
  input.parentNode.appendChild(picker);
  setAttributes(input, {
    role: "combobox",
    "aria-autocomplete": "list",
    "aria-controls": picker.id,
    "aria-expanded": "false",
  });

  let matches = [];
  let queryRange = null;
  let navigation;

  const closePicker = () => {
    clearElement(picker);
    matches = [];
    queryRange = null;
    if (navigation) navigation.reset();
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
  };

  const selectEmoji = (emojiCharacter) => {
    if (!queryRange) return;
    input.setRangeText(emojiCharacter, queryRange.start, queryRange.end, "end");
    closePicker();
    input.focus();
    input.dispatchEvent(new Event("input", { bubbles: true }));
  };

  navigation = keyboardNavigation(
    input,
    picker,
    (index) => {
      if (matches[index]) selectEmoji(matches[index].emoji);
    },
    closePicker,
  );

  const onInput = () => {
    const caret = input.selectionStart;
    const beforeCaret = input.value.slice(0, caret);
    const token = /:([a-z0-9_+-]+)$/i.exec(beforeCaret);
    if (!token) return closePicker();

    const prefix = token[1].toLowerCase();
    queryRange = { start: caret - token[0].length, end: caret };
    matches = Object.keys(emoji)
      .filter((name) => name.toLowerCase().startsWith(prefix))
      .slice(0, 30)
      .map((name) => ({ name, emoji: emoji[name] }));

    if (!matches.length) return closePicker();
    clearElement(picker);
    navigation.reset();
    matches.forEach((match, index) =>
      picker.appendChild(createLink(match, index, picker.id)),
    );
    input.setAttribute("aria-expanded", "true");
  };
  input.addEventListener("input", onInput);

  const destroy = () => {
    closePicker();
    input.removeAttribute("aria-controls");
    input.removeAttribute("aria-expanded");
    input.removeAttribute("aria-autocomplete");
    input.removeAttribute("aria-activedescendant");
    input.removeAttribute("role");
    input.removeEventListener("input", onInput);
    navigation.destroy();
    picker.remove();
  };

  return {
    input,
    picker,
    destroy,
  };
};
