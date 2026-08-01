import { describe, expect, it } from "vitest";
import appendOrUpdateInput from "./appendOrUpdateInput";

const createForm = () => {
  document.body.innerHTML = "";

  const formElement = document.createElement("form");

  const childInputElement = document.createElement("input");
  childInputElement.setAttribute("id", "existing-id");
  childInputElement.setAttribute("name", "existing-name");
  childInputElement.setAttribute("value", "existing-value");

  formElement.appendChild(childInputElement);

  document.body.appendChild(formElement);

  return {
    formElement,
    childInputElement,
  };
};

describe("appendOrUpdateInput", () => {
  it("should append an input field if it doesn't exist", () => {
    const { formElement, childInputElement } = createForm();

    appendOrUpdateInput({
      formElement,
      id: "new-id",
      name: "new-name",
      value: "new-value",
    });

    const preExistingInputElement = formElement.children.namedItem(
      childInputElement.name,
    ) as HTMLInputElement;

    expect(preExistingInputElement.id).toEqual(childInputElement.id);
    expect(preExistingInputElement.name).toEqual(childInputElement.name);
    expect(preExistingInputElement.value).toEqual(childInputElement.value);

    const appendedInputElement = formElement.children.namedItem(
      "new-name",
    ) as HTMLInputElement;

    expect(appendedInputElement.id).toEqual("new-id");
    expect(appendedInputElement.name).toEqual("new-name");
    expect(appendedInputElement.value).toEqual("new-value");
  });

  it("should append a new input when a non-input control shares the name", () => {
    const { formElement } = createForm();

    const selectElement = document.createElement("select");
    selectElement.setAttribute("name", "utm_source");
    formElement.appendChild(selectElement);

    appendOrUpdateInput({
      formElement,
      id: "formtrack_utm_source",
      name: "utm_source",
      value: "google",
    });

    expect(selectElement.getAttribute("value")).toBeNull();

    const appendedInputElement = formElement.querySelector(
      "#formtrack_utm_source",
    ) as HTMLInputElement;

    expect(appendedInputElement.name).toEqual("utm_source");
    expect(appendedInputElement.value).toEqual("google");
  });

  it("should update an input field if it does exist", () => {
    const { formElement, childInputElement } = createForm();

    appendOrUpdateInput({
      formElement,
      id: childInputElement.id,
      name: childInputElement.name,
      value: "new-value",
    });

    const updatedInputElement = formElement.children.namedItem(
      childInputElement.name,
    ) as HTMLInputElement;

    expect(updatedInputElement.id).toEqual(childInputElement.id);
    expect(updatedInputElement.name).toEqual(childInputElement.name);
    expect(updatedInputElement.value).toEqual("new-value");
  });
});
