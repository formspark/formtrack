import registerPoller from "./registerPoller";

describe("registerPoller", () => {
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
});
