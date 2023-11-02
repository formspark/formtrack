import registerPoller from "./registerPoller";

describe("registerPoller", () => {
  it("should not register the poller if window.__FORMTRACK_POLLER__ is truthy", () => {
    window.__FORMTRACK_POLLER__ = true;
    const listener = registerPoller();
    expect(listener).toBeNull();
  });

  it("should register the poller if window.__FORMTRACK_POLLER__ is falsy", () => {
    window.__FORMTRACK_POLLER__ = undefined;
    const poller = registerPoller();
    expect(poller).not.toBeNull();
    if (poller) {
      clearInterval(poller);
    }
  });
});
