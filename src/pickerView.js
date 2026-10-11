import createLink from "./createLink.js";
import setAttributes from "./setAttributes.js";

let instanceCount = 0;

export default (input) => {
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

  return {
    element: picker,
    clear: () => {
      picker.replaceChildren();
      input.setAttribute("aria-expanded", "false");
      input.removeAttribute("aria-activedescendant");
    },
    render: (matches) => {
      picker.replaceChildren(
        ...matches.map((match, index) => createLink(match, index, picker.id)),
      );
      input.setAttribute("aria-expanded", "true");
    },
    destroy: () => {
      input.removeAttribute("aria-controls");
      input.removeAttribute("aria-expanded");
      input.removeAttribute("aria-autocomplete");
      input.removeAttribute("aria-activedescendant");
      input.removeAttribute("role");
      picker.remove();
    },
  };
};
