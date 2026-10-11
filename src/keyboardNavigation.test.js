import { describe, expect, it, vi } from "vitest";
import keyboardNavigation from "./keyboardNavigation.js";

describe("keyboardNavigation", () => {
  it("removes keyboard and click handlers when destroyed", () => {
    const input = document.createElement("input");
    const picker = document.createElement("div");
    const option = document.createElement("div");
    option.setAttribute("role", "option");
    option.id = "suggestion-0";
    option.dataset.index = "0";
    picker.appendChild(option);

    const select = vi.fn();
    const close = vi.fn();
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
