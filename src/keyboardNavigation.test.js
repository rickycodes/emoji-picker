import { describe, expect, it, vi } from "vitest";
import keyboardNavigation from "./keyboardNavigation.js";
import {
  ELEMENT_DIV,
  ROLE_OPTION,
  ROLE,
  ZERO,
  EVENT_INPUT,
} from "./constants.js";

describe("keyboardNavigation", () => {
  it("removes keyboard and click handlers when destroyed", () => {
    const input = document.createElement(EVENT_INPUT);
    const picker = document.createElement(ELEMENT_DIV);
    const option = document.createElement(ELEMENT_DIV);
    option.setAttribute(ROLE, ROLE_OPTION);
    option.id = `suggestion-${ZERO}`;
    option.dataset.index = `${ZERO}`;
    picker.appendChild(option);

    const [select, close] = [vi.fn(), vi.fn()];
    const navigation = keyboardNavigation(input, picker, select, close);
    navigation.destroy();

    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
    );
    option.click();

    expect(input.hasAttribute("aria-activedescendant")).toBe(false);
    expect(select).not.toHaveBeenCalled();
    expect(close).not.toHaveBeenCalled();
  });
});
