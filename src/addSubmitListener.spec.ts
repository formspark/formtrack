import addSubmitListener from "./addSubmitListener";

describe("addSubmitListener", () => {
  it("should not register the listener if window.__FORMTRACK_SUBMIT_LISTENER__ is truthy", () => {
    window.__FORMTRACK_SUBMIT_LISTENER__ = true;
    const listener = addSubmitListener();
    expect(listener).toBeNull();
  });

  it("should register the listener if window.__FORMTRACK_SUBMIT_LISTENER__ is falsy", () => {
    window.__FORMTRACK_SUBMIT_LISTENER__ = undefined;
    const listener = addSubmitListener();
    expect(listener).not.toBeNull();
    if (listener) {
      document.removeEventListener("submit", listener);
    }
  });
});
