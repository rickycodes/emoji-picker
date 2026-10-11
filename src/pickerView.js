import createLink from "./createLink.js";
import setAttributes from "./setAttributes.js";
import {
  ARIA_ACTIVE_DESCENDANT,
  ARIA_AUTOCOMPLETE,
  ARIA_CONTROLS,
  ARIA_EXPANDED,
  ARIA_FALSE,
  ARIA_LABEL,
  ELEMENT_DIV,
  ARIA_TRUE,
  ROLE,
  ROLE_COMBOBOX,
  ROLE_LISTBOX,
  ZERO,
} from "./constants.js";

let instanceCount = ZERO;

export default (input) => {
  const picker = document.createElement(ELEMENT_DIV);
  picker.className = "picker";
  picker.id = input.id
    ? `${input.id}-suggestions`
    : `emoji-picker-${++instanceCount}-suggestions`;
  setAttributes(picker, {
    [ROLE]: ROLE_LISTBOX,
    [ARIA_LABEL]: "Emoji suggestions",
  });
  input.parentNode.appendChild(picker);
  setAttributes(input, {
    [ROLE]: ROLE_COMBOBOX,
    [ARIA_AUTOCOMPLETE]: "list",
    [ARIA_CONTROLS]: picker.id,
    [ARIA_EXPANDED]: ARIA_FALSE,
  });

  return {
    element: picker,
    clear: () => {
      picker.replaceChildren();
      input.setAttribute(ARIA_EXPANDED, ARIA_FALSE);
      input.removeAttribute(ARIA_ACTIVE_DESCENDANT);
    },
    render: (matches) => {
      picker.replaceChildren(
        ...matches.map((match, index) => createLink(match, index, picker.id)),
      );
      input.setAttribute(ARIA_EXPANDED, ARIA_TRUE);
    },
    destroy: () => {
      input.removeAttribute(ARIA_CONTROLS);
      input.removeAttribute(ARIA_EXPANDED);
      input.removeAttribute(ARIA_AUTOCOMPLETE);
      input.removeAttribute(ARIA_ACTIVE_DESCENDANT);
      input.removeAttribute(ROLE);
      picker.remove();
    },
  };
};
