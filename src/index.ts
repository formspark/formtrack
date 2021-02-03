import "url-search-params-polyfill";

import addSubmitListener from "./addSubmitListener";

declare global {
  interface Window {
    __FORMTRACK_SUBMIT_LISTENER__: boolean | undefined;
  }
}

addSubmitListener();
