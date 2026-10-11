import keyboardNavigation from "./keyboardNavigation.js";
import { findCompletedShortcode, findSuggestions } from "./emojiSearch.js";
import createPickerView from "./pickerView.js";

export default (selector, emoji) => {
  const input = document.querySelector(selector);
  if (!input) throw new Error(`Emoji picker input not found: ${selector}`);

  const view = createPickerView(input);
  const picker = view.element;

  let matches = [];
  let queryRange = null;
  let navigation;

  const closePicker = () => {
    view.clear();
    matches = [];
    queryRange = null;
    if (navigation) navigation.reset();
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
    const completedShortcode = findCompletedShortcode(beforeCaret, emoji);
    if (completedShortcode) {
      input.setRangeText(
        completedShortcode.emoji,
        completedShortcode.start,
        completedShortcode.end,
        "preserve",
      );
      closePicker();
      input.dispatchEvent(new Event("input", { bubbles: true }));
      return;
    }

    const suggestions = findSuggestions(beforeCaret, emoji);
    if (!suggestions) return closePicker();

    queryRange = suggestions.range;
    matches = suggestions.matches;

    if (!matches.length) return closePicker();
    navigation.reset();
    view.render(matches);
  };
  input.addEventListener("input", onInput);

  const destroy = () => {
    closePicker();
    input.removeEventListener("input", onInput);
    navigation.destroy();
    view.destroy();
  };

  return {
    input,
    picker,
    destroy,
  };
};
