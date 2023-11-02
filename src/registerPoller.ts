import appendOrUpdateInput from "./appendOrUpdateInput";

const PARAMETER_NAMES = [
  "ref",
  "referrer",
  "utm_campaign",
  "utm_content",
  "utm_medium",
  "utm_source",
  "utm_term",
];

const FORM_ATTRIBUTE = "data-formtrack";
const CUSTOM_PARAMETERS_ATTRIBUTE = "data-formtrack-params";

const ID_PREFIX = "formtrack_";

const POLL_INTERVAL = 5 * 1000;

const registerPoller = () => {
  if (typeof document !== "undefined" && !window.__FORMTRACK_POLLER__) {
    window.__FORMTRACK_POLLER__ = true;

    const poll = () => {
      const searchParameters = new URLSearchParams(window.location.search);
      const forms = document.querySelectorAll(`form[${FORM_ATTRIBUTE}]`);

      forms.forEach((element) => {
        const formElement = element as HTMLFormElement;

        const customParameterNames = (
          formElement.getAttribute(CUSTOM_PARAMETERS_ATTRIBUTE) || ""
        )
          .split(",")
          .map((string) => string.trim())
          .filter((string) => string.length > 0);

        [...PARAMETER_NAMES, ...customParameterNames].forEach(
          (parameterName) => {
            const id = `${ID_PREFIX}${parameterName}`;
            const name = parameterName;
            const value = searchParameters.get(parameterName);
            if (value) {
              appendOrUpdateInput({ formElement, id, name, value });
            }
          }
        );
      });
    };

    poll();
    const intervalId = setInterval(poll, POLL_INTERVAL);

    return {
      unregister: () => {
        window.__FORMTRACK_POLLER__ = false;
        clearInterval(intervalId);
      },
    };
  }
  return null;
};

export default registerPoller;
