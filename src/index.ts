import "url-search-params-polyfill";

import registerPoller from "./registerPoller";

declare global {
  interface Window {
    __FORMTRACK_POLLER__: boolean | undefined;
  }
}

registerPoller();
