import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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

    it("injects into every form on the page independently", () => {
      history.replaceState(null, "", "/?utm_source=google");
      document.body.innerHTML = `
        <form id="a" data-formtrack></form>
        <form id="b" data-formtrack></form>
      `;

      const poller = registerPoller();

      const a = document.getElementById("a")!;
      const b = document.getElementById("b")!;
      expect(a.querySelectorAll("[name='utm_source']").length).toBe(1);
      expect(b.querySelectorAll("[name='utm_source']").length).toBe(1);

      poller?.unregister();
    });

    it("trims whitespace and skips empty entries in data-formtrack-params", () => {
      history.replaceState(null, "", "/?affiliate=alice&promo=spring");
      document.body.innerHTML = `<form data-formtrack data-formtrack-params="  affiliate ,, promo ,  "></form>`;

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

    it("decodes URL-encoded parameter values", () => {
      history.replaceState(
        null,
        "",
        "/?utm_term=running+shoes&utm_source=a%26b",
      );
      document.body.innerHTML = `<form data-formtrack></form>`;

      const poller = registerPoller();

      const form = document.querySelector("form")!;
      expect(
        (form.querySelector("#formtrack_utm_term") as HTMLInputElement).value,
      ).toBe("running shoes");
      expect(
        (form.querySelector("#formtrack_utm_source") as HTMLInputElement).value,
      ).toBe("a&b");

      poller?.unregister();
    });

    it("does nothing when the URL has no matching parameters", () => {
      history.replaceState(null, "", "/");
      document.body.innerHTML = `<form data-formtrack></form>`;

      const poller = registerPoller();

      const form = document.querySelector("form")!;
      expect(form.children.length).toBe(0);

      poller?.unregister();
    });

    it("skips parameters whose URL value is the empty string", () => {
      history.replaceState(null, "", "/?utm_source=");
      document.body.innerHTML = `<form data-formtrack></form>`;

      const poller = registerPoller();

      const form = document.querySelector("form")!;
      expect(form.querySelector("#formtrack_utm_source")).toBeNull();

      poller?.unregister();
    });

    it("picks up a form that is added to the DOM after registration", () => {
      vi.useFakeTimers();
      try {
        history.replaceState(null, "", "/?utm_source=google");
        const poller = registerPoller();

        // No form yet -- nothing injected.
        expect(document.querySelector("[name='utm_source']")).toBeNull();

        document.body.innerHTML = `<form data-formtrack></form>`;
        vi.advanceTimersByTime(5_000);

        const form = document.querySelector("form")!;
        expect(
          (form.querySelector("#formtrack_utm_source") as HTMLInputElement)
            .value,
        ).toBe("google");

        poller?.unregister();
      } finally {
        vi.useRealTimers();
      }
    });

    it("unregister stops further polling", () => {
      vi.useFakeTimers();
      try {
        history.replaceState(null, "", "/?utm_source=google");
        const poller = registerPoller();
        poller?.unregister();

        document.body.innerHTML = `<form data-formtrack></form>`;
        vi.advanceTimersByTime(60_000);

        expect(document.querySelector("[name='utm_source']")).toBeNull();
      } finally {
        vi.useRealTimers();
      }
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
