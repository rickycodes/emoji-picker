import setAttributes from "./setAttributes.js";
import {
  ARIA_FALSE,
  ARIA_LABEL,
  ARIA_SELECTED,
  ELEMENT_DIV,
  ROLE,
  ROLE_OPTION,
} from "./constants.js";

export default (match, index, pickerId) => {
  const option = document.createElement(ELEMENT_DIV);
  option.textContent = match.emoji;
  option.id = `${pickerId}-option-${index}`;
  option.dataset.index = index;
  setAttributes(option, {
    [ROLE]: ROLE_OPTION,
    [ARIA_LABEL]: match.name.replace(/_/g, " "),
    [ARIA_SELECTED]: ARIA_FALSE,
    class: "emoji",
  });
  return option;
};
