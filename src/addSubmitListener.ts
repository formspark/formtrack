import appendOrUpdateInput from "./appendOrUpdateInput";

const addSubmitListener = () => {
  if (typeof document !== "undefined") {
    if (!window.__FORMTRACK_SUBMIT_LISTENER__) {
      window.__FORMTRACK_SUBMIT_LISTENER__ = true;
      const listener = (event: Event) => {
        try {
          const formEventTarget = event.target;
          if (formEventTarget) {
            const formElement = formEventTarget as HTMLFormElement;
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
                  appendOrUpdateInput({
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
      };
      document.addEventListener("submit", listener);
      return listener;
    }
  }
  return null;
};

export default addSubmitListener;
