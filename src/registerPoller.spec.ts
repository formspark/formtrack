import { afterEach, beforeEach, describe, expect, it } from "vitest";
import registerPoller from "./registerPoller";

describe("registerPoller", () => {
  afterEach(() => {
    window.__FORMTRACK_POLLER__ = undefined;
    document.body.innerHTML = "";
    history.replaceState(null, "", "/");
  });

  it("should not register the poller if window.__FORMTRACK_POLLER__ is truthy", () => {
    window.__FORMTRACK_POLLER__ = true;
    const poller = registerPoller();
    expect(poller).toBeNull();
  });

  it("should register the poller if window.__FORMTRACK_POLLER__ is falsy", () => {
    window.__FORMTRACK_POLLER__ = undefined;
    const poller = registerPoller();
    expect(poller).not.toBeNull();
    poller?.unregister();
  });

  it("should register the poller only once", () => {
    const poller1 = registerPoller();
    expect(poller1).not.toBeNull();

    const poller2 = registerPoller();
    expect(poller2).toBeNull();

    poller1?.unregister();
    poller2?.unregister();
  });

  describe("integration", () => {
    beforeEach(() => {
      document.body.innerHTML = "";
      window.__FORMTRACK_POLLER__ = undefined;
    });

    it("injects standard UTM parameters from the URL into matching forms", () => {
      history.replaceState(
        null,
        "",
        "/?utm_source=google&utm_medium=cpc&utm_campaign=spring",
      );
      document.body.innerHTML = `<form data-formtrack></form>`;

      const poller = registerPoller();

      const form = document.querySelector("form")!;
      expect(
        (form.querySelector("#formtrack_utm_source") as HTMLInputElement).value,
      ).toBe("google");
      expect(
        (form.querySelector("#formtrack_utm_medium") as HTMLInputElement).value,
      ).toBe("cpc");
      expect(
        (form.querySelector("#formtrack_utm_campaign") as HTMLInputElement)
          .value,
      ).toBe("spring");

      poller?.unregister();
    });

    it("does not inject parameters that are not in the URL", () => {
      history.replaceState(null, "", "/?utm_source=google");
      document.body.innerHTML = `<form data-formtrack></form>`;

      const poller = registerPoller();

      const form = document.querySelector("form")!;
      expect(form.querySelector("#formtrack_utm_medium")).toBeNull();
      expect(form.querySelector("#formtrack_utm_campaign")).toBeNull();

      poller?.unregister();
    });

    it("ignores forms without the data-formtrack attribute", () => {
      history.replaceState(null, "", "/?utm_source=google");
      document.body.innerHTML = `<form id="other"></form>`;

      const poller = registerPoller();

      const form = document.querySelector("form")!;
      expect(form.querySelector("#formtrack_utm_source")).toBeNull();

      poller?.unregister();
    });

    it("injects custom parameters listed in data-formtrack-params", () => {
      history.replaceState(null, "", "/?affiliate=alice&promo=spring");
      document.body.innerHTML = `<form data-formtrack data-formtrack-params="affiliate, promo"></form>`;

      const poller = registerPoller();

      const form = document.querySelector("form")!;
      expect(
        (form.querySelector("#formtrack_affiliate") as HTMLInputElement).value,
      ).toBe("alice");
      expect(
        (form.querySelector("#formtrack_promo") as HTMLInputElement).value,
      ).toBe("spring");

      poller?.unregister();
    });

    it("updates existing inputs rather than duplicating them on subsequent polls", () => {
      history.replaceState(null, "", "/?utm_source=google");
      document.body.innerHTML = `<form data-formtrack></form>`;

      const poller = registerPoller();
      const form = document.querySelector("form")!;

      const initial = form.querySelectorAll("#formtrack_utm_source");
      expect(initial.length).toBe(1);

      history.replaceState(null, "", "/?utm_source=bing");
      // The poller's setInterval would fire after 5s; here we just confirm
      // that calling again would update, not duplicate. We re-trigger by
      // dispatching a fresh poller call after unregister.
      poller?.unregister();
      window.__FORMTRACK_POLLER__ = undefined;
      const second = registerPoller();

      const after = form.querySelectorAll("#formtrack_utm_source");
      expect(after.length).toBe(1);
      expect((after[0] as HTMLInputElement).value).toBe("bing");

      second?.unregister();
    });
  });
});
