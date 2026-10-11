import { afterEach, describe, expect, it } from "vitest";
import picker from "./index.js";
import emoji from "./emoji.test-fixtures.js";

let instance;

const setup = (value = "") => {
  document.body.innerHTML = '<div><input class="input"></div>';
  const input = document.querySelector(".input");
  input.value = value;
  instance = picker(".input", emoji);
  return input;
};

afterEach(() => {
  instance?.destroy();
  instance = undefined;
  document.body.innerHTML = "";
});

describe("emoji picker", () => {
  it("shows matching suggestions and closes when there are no matches", () => {
    const input = setup(":do");
    input.setSelectionRange(input.value.length, input.value.length);
    input.dispatchEvent(new Event("input", { bubbles: true }));

    expect(instance.picker.querySelectorAll('[role="option"]')).toHaveLength(3);

    input.value = ":xyz";
    input.setSelectionRange(input.value.length, input.value.length);
    input.dispatchEvent(new Event("input", { bubbles: true }));

    expect(instance.picker.querySelectorAll('[role="option"]')).toHaveLength(0);
    expect(input.getAttribute("aria-expanded")).toBe("false");
  });

  it("replaces an exact shortcode when followed by a space", () => {
    const input = setup("Say :cat: ");
    input.setSelectionRange(input.value.length, input.value.length);
    input.dispatchEvent(new Event("input", { bubbles: true }));

    expect(input.value).toBe("Say 🐱 ");
    expect(input.selectionStart).toBe(input.value.length);
  });

  it("inserts a suggestion clicked in the middle of the input", () => {
    const input = setup("hello :do world");
    const caret = "hello :do".length;
    input.setSelectionRange(caret, caret);
    input.dispatchEvent(new Event("input", { bubbles: true }));

    instance.picker.querySelector('[data-index="1"]').click();

    expect(input.value).toBe("hello 🐕 world");
    expect(input.getAttribute("aria-expanded")).toBe("false");
  });

  it("leaves unknown completed shortcodes unchanged", () => {
    const input = setup("Say :unknown: ");
    input.setSelectionRange(input.value.length, input.value.length);
    input.dispatchEvent(new Event("input", { bubbles: true }));

    expect(input.value).toBe("Say :unknown: ");
  });

  it("moves the active suggestion with arrow keys and inserts it at the caret", () => {
    const input = setup("hello :do world");
    const caret = "hello :do".length;
    input.setSelectionRange(caret, caret);
    input.dispatchEvent(new Event("input", { bubbles: true }));

    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
    );
    expect(input.getAttribute("aria-activedescendant")).toBe(
      instance.picker.querySelector('[data-index="0"]').id,
    );

    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
    );
    expect(input.getAttribute("aria-activedescendant")).toBe(
      instance.picker.querySelector('[data-index="1"]').id,
    );

    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    );

    expect(input.value).toBe("hello 🐕 world");
    expect(input.getAttribute("aria-expanded")).toBe("false");
  });

  it("keeps keyboard navigation within the first and last suggestions", () => {
    const input = setup(":do");
    input.setSelectionRange(input.value.length, input.value.length);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    const options = instance.picker.querySelectorAll('[role="option"]');
    const press = (key) =>
      input.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));

    press("ArrowDown");
    press("ArrowLeft");
    expect(input.getAttribute("aria-activedescendant")).toBe(options[0].id);

    press("ArrowRight");
    press("ArrowRight");
    expect(input.getAttribute("aria-activedescendant")).toBe(options[2].id);

    press("ArrowRight");
    expect(input.getAttribute("aria-activedescendant")).toBe(options[2].id);
    press("ArrowUp");
    expect(input.hasAttribute("aria-activedescendant")).toBe(false);
  });

  it("gives multiple pickers distinct IDs and matching input controls", () => {
    document.body.innerHTML =
      '<div><input id="first"></div><div><input id="second"></div>';
    const first = picker("#first", emoji);
    const second = picker("#second", emoji);

    expect(first.picker.id).not.toBe(second.picker.id);
    expect(first.input.getAttribute("aria-controls")).toBe(first.picker.id);
    expect(second.input.getAttribute("aria-controls")).toBe(second.picker.id);

    first.destroy();
    second.destroy();
  });

  it("closes on Escape and destroy removes picker attributes and behavior", () => {
    const input = setup(":dog");
    input.setSelectionRange(input.value.length, input.value.length);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(input.getAttribute("aria-expanded")).toBe("true");

    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    expect(input.getAttribute("aria-expanded")).toBe("false");

    instance.destroy();
    instance = undefined;

    expect(document.querySelector(".picker")).toBeNull();
    expect(input.hasAttribute("role")).toBe(false);

    input.value = ":dog";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(document.querySelector(".picker")).toBeNull();
  });
});
