const appendOrUpdateInput = ({
  formElement,
  id,
  name,
  value,
}: {
  formElement: HTMLFormElement;
  id: string;
  name: string;
  value: string;
}) => {
  const existing = formElement.elements.namedItem(name);
  let input = existing instanceof HTMLInputElement ? existing : null;
  if (!input) {
    input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("id", id);
    input.setAttribute("name", name);
    formElement.appendChild(input);
  }
  input.setAttribute("value", value);
};

export default appendOrUpdateInput;
