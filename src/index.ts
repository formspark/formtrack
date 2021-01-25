import "url-search-params-polyfill";

const appendOrUpdateFormtrackInput = ({
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

const addSubmitListener = () => {
  if (typeof document !== "undefined") {
    document.addEventListener("submit", (event) => {
      try {
        const formEventTarget = event.target;
        if (formEventTarget) {
          const formElement = formEventTarget as HTMLElement;
          const shouldTrack =
            typeof formElement.dataset.formtrack !== "undefined";
          if (shouldTrack) {
            const searchParameters = new URLSearchParams(
              window.location.search
            );
            const supportedParameterNames = [
              "referrer",
              "utm_campaign",
              "utm_content",
              "utm_medium",
              "utm_source",
              "utm_term",
            ];
            for (let i = 0; i < supportedParameterNames.length; i++) {
              const parameterName = supportedParameterNames[i];
              const id = `formtrack_${parameterName}`;
              const name = parameterName;
              const value = searchParameters.get(parameterName);
              if (value) {
                appendOrUpdateFormtrackInput({
                  formElement,
                  id,
                  name,
                  value,
                });
              }
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
      return true;
    });
  }
};

addSubmitListener();
