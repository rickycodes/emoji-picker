export default (element, attributes) => {
  Object.entries(attributes).forEach(([name, value]) => {
    element.setAttribute(name, value);
  });
};
