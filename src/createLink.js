import setAttributes from "./setAttributes.js";

export default (match, index, pickerId) => {
  const option = document.createElement("div");
  option.textContent = match.emoji;
  option.id = `${pickerId}-option-${index}`;
  option.dataset.index = index;
  setAttributes(option, {
    role: "option",
    "aria-label": match.name.replace(/_/g, " "),
    "aria-selected": "false",
    class: "emoji",
  });
  return option;
};
