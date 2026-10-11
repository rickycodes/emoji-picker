import {
  ARIA_ACTIVE_DESCENDANT,
  ARIA_FALSE,
  ARIA_SELECTED,
  ARIA_TRUE,
  EVENT_CLICK,
  EVENT_KEYDOWN,
  OPTION_SELECTOR,
} from "./constants.js";

export default (input, picker, select, close) => {
  let activeIndex = -1;

  const options = () => Array.from(picker.querySelectorAll(OPTION_SELECTOR));
  const setActive = (index) => {
    const items = options();
    if (!items.length) return;
    activeIndex = Math.max(0, Math.min(index, items.length - 1));
    items.forEach((item, itemIndex) => {
      item.setAttribute(
        ARIA_SELECTED,
        itemIndex === activeIndex ? ARIA_TRUE : ARIA_FALSE,
      );
    });
    input.setAttribute(ARIA_ACTIVE_DESCENDANT, items[activeIndex].id);
  };
  const clearActive = () => {
    activeIndex = -1;
    options().forEach((item) => item.setAttribute(ARIA_SELECTED, ARIA_FALSE));
    input.removeAttribute(ARIA_ACTIVE_DESCENDANT);
  };

  const onKeydown = (event) => {
    const items = options();
    if (!items.length) return;

    if (event.key === "ArrowDown" && activeIndex < 0) {
      event.preventDefault();
      setActive(0);
    } else if (event.key === "ArrowLeft" && activeIndex >= 0) {
      event.preventDefault();
      setActive(activeIndex - 1);
    } else if (event.key === "ArrowRight" && activeIndex >= 0) {
      event.preventDefault();
      setActive(activeIndex + 1);
    } else if (event.key === "ArrowUp" && activeIndex >= 0) {
      event.preventDefault();
      clearActive();
    } else if (event.key === "Enter") {
      if (activeIndex >= 0) {
        event.preventDefault();
        select(activeIndex);
      }
    } else if (event.key === "Escape") {
      close();
    }
  };
  input.addEventListener(EVENT_KEYDOWN, onKeydown);

  const onClick = (event) => {
    const option = event.target.closest(OPTION_SELECTOR);
    if (option && picker.contains(option)) select(Number(option.dataset.index));
  };
  picker.addEventListener(EVENT_CLICK, onClick);

  return {
    reset: () => {
      clearActive();
    },
    destroy: () => {
      input.removeEventListener(EVENT_KEYDOWN, onKeydown);
      picker.removeEventListener(EVENT_CLICK, onClick);
    },
  };
};
