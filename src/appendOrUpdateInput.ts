const appendOrUpdateInput = ({
  formElement,
  id,
  name,
  value,
}: {
  formElement: HTMLElement;
  id: string;
  name: string;
  value: string;
}) => {
  console.log(
    JSON.stringify(
      {
        id,
        name,
        value,
      },
      null,
      2
    )
  );
  let input = document.getElementById(id);
  if (!input) {
    const newInput = document.createElement("input");
    newInput.setAttribute("type", "hidden");
    newInput.setAttribute("id", id);
    newInput.setAttribute("name", name);
    formElement.appendChild(newInput);
    input = newInput;
  }
  input.setAttribute("value", value);
};

export default appendOrUpdateInput;
