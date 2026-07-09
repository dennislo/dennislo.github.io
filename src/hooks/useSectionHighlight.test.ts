import { renderHook, act, fireEvent, cleanup } from "@testing-library/react";
import {
  useSectionHighlight,
  HIGHLIGHT_DURATION_MS,
} from "./useSectionHighlight";

const HIGHLIGHT_CLASS = "section-heading-highlight";
// Matches the "~5s" safety timeout described in the hook sketch (Testing Plan
// item 7). If the hook ever changes this value, update it here too.
const OBSERVER_SAFETY_MS = 5000;

/**
 * jsdom does not implement IntersectionObserver. This mock lets tests
 * manually invoke the observer callback to simulate the heading scrolling
 * into (or never coming into) view.
 */
class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];

  callback: IntersectionObserverCallback;
  observedElement: Element | null = null;
  observe = jest.fn((element: Element) => {
    this.observedElement = element;
  });
  unobserve = jest.fn();
  disconnect = jest.fn();
  takeRecords = jest.fn((): IntersectionObserverEntry[] => []);

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    MockIntersectionObserver.instances.push(this);
  }

  /** Test helper: simulate the observer reporting an intersection entry. */
  simulateIntersection(isIntersecting: boolean) {
    this.callback(
      [{ isIntersecting } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
}

const getLatestObserver = (): MockIntersectionObserver => {
  const observer =
    MockIntersectionObserver.instances[
      MockIntersectionObserver.instances.length - 1
    ];
  if (!observer) {
    throw new Error("Expected an IntersectionObserver to have been created");
  }
  return observer;
};

/**
 * Sets window.location.hash without triggering jsdom's own (async,
 * fake-timer-driven) hashchange dispatch, so tests can dispatch hashchange
 * explicitly and deterministically.
 */
const setHashSilently = (hash: string) => {
  const url = hash
    ? `${window.location.pathname}${hash}`
    : window.location.pathname;
  window.history.replaceState(null, "", url);
};

const clickAnchorWithHref = (href: string) => {
  const anchor = document.createElement("a");
  anchor.setAttribute("href", href);
  document.body.appendChild(anchor);
  act(() => {
    fireEvent.click(anchor);
  });
  anchor.remove();
};

describe("useSectionHighlight", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    MockIntersectionObserver.instances = [];
    (
      window as unknown as { IntersectionObserver: unknown }
    ).IntersectionObserver = MockIntersectionObserver;

    setHashSilently("");

    document.body.innerHTML = `
      <section id="about">
        <h2 data-section-heading>About</h2>
      </section>
      <section id="projects">
        <h2 data-section-heading>Projects</h2>
      </section>
      <section id="hero">
        <h2>Welcome</h2>
      </section>
    `;
  });

  afterEach(() => {
    cleanup();
    document.body.innerHTML = "";
    jest.clearAllTimers();
    jest.useRealTimers();
    MockIntersectionObserver.instances = [];
  });

  it("observes the marked heading for the initial location.hash on mount and highlights it on intersection", () => {
    // Arrange
    setHashSilently("#about");
    const heading = document.querySelector(
      "#about [data-section-heading]",
    ) as HTMLElement;

    // Act
    renderHook(() => useSectionHighlight());
    const observer = getLatestObserver();

    // Assert: observed immediately, not yet highlighted
    expect(observer.observe).toHaveBeenCalledWith(heading);
    expect(heading).not.toHaveClass(HIGHLIGHT_CLASS);

    // Act: simulate the heading scrolling into view
    act(() => {
      observer.simulateIntersection(true);
    });

    // Assert
    expect(heading).toHaveClass(HIGHLIGHT_CLASS);
    expect(observer.disconnect).toHaveBeenCalled();
  });

  it("removes the highlight class after exactly HIGHLIGHT_DURATION_MS", () => {
    // Arrange
    setHashSilently("#about");
    const heading = document.querySelector(
      "#about [data-section-heading]",
    ) as HTMLElement;
    renderHook(() => useSectionHighlight());
    act(() => {
      getLatestObserver().simulateIntersection(true);
    });
    expect(heading).toHaveClass(HIGHLIGHT_CLASS);

    // Act: advance to just before the duration elapses
    act(() => {
      jest.advanceTimersByTime(HIGHLIGHT_DURATION_MS - 1);
    });

    // Assert: still highlighted
    expect(heading).toHaveClass(HIGHLIGHT_CLASS);

    // Act: advance the final millisecond
    act(() => {
      jest.advanceTimersByTime(1);
    });

    // Assert: highlight has been removed
    expect(heading).not.toHaveClass(HIGHLIGHT_CLASS);
  });

  it("triggers the observe-intersect-highlight flow when a hashchange event fires for a new target", () => {
    // Arrange
    renderHook(() => useSectionHighlight());
    expect(MockIntersectionObserver.instances).toHaveLength(0);

    // Act
    setHashSilently("#projects");
    act(() => {
      window.dispatchEvent(new Event("hashchange"));
    });

    // Assert
    const observer = getLatestObserver();
    const heading = document.querySelector(
      "#projects [data-section-heading]",
    ) as HTMLElement;
    expect(observer.observe).toHaveBeenCalledWith(heading);

    act(() => {
      observer.simulateIntersection(true);
    });
    expect(heading).toHaveClass(HIGHLIGHT_CLASS);
  });

  it("re-triggers the highlight when clicking an anchor even when the hash is already set to that value", () => {
    // Arrange: highlight #about once and let it fully expire
    setHashSilently("#about");
    const heading = document.querySelector(
      "#about [data-section-heading]",
    ) as HTMLElement;
    renderHook(() => useSectionHighlight());
    act(() => {
      getLatestObserver().simulateIntersection(true);
    });
    act(() => {
      jest.advanceTimersByTime(HIGHLIGHT_DURATION_MS);
    });
    expect(heading).not.toHaveClass(HIGHLIGHT_CLASS);
    expect(window.location.hash).toBe("#about");

    const observerCountBeforeReclick =
      MockIntersectionObserver.instances.length;

    // Act: click a same-hash anchor (hash never changes, no hashchange fires)
    clickAnchorWithHref("#about");

    // Assert: a fresh observer was created for the re-click
    expect(MockIntersectionObserver.instances.length).toBeGreaterThan(
      observerCountBeforeReclick,
    );
    const observer = getLatestObserver();
    expect(observer.observe).toHaveBeenCalledWith(heading);

    act(() => {
      observer.simulateIntersection(true);
    });
    expect(heading).toHaveClass(HIGHLIGHT_CLASS);
  });

  it("does nothing when the clicked/triggered section has no [data-section-heading] child (e.g. Hero)", () => {
    // Arrange
    setHashSilently("#hero");

    // Act
    renderHook(() => useSectionHighlight());

    // Assert: initial-hash trigger was a safe no-op
    expect(MockIntersectionObserver.instances).toHaveLength(0);

    // Act: clicking a hero anchor is also a no-op
    clickAnchorWithHref("#hero");

    // Assert
    expect(MockIntersectionObserver.instances).toHaveLength(0);
    const heroHeading = document.querySelector("#hero h2") as HTMLElement;
    expect(heroHeading).not.toHaveClass(HIGHLIGHT_CLASS);
  });

  it("cancels an active highlight when navigating to an unmarked section (e.g. Hero)", () => {
    // Arrange: highlight #about
    setHashSilently("#about");
    const aboutHeading = document.querySelector(
      "#about [data-section-heading]",
    ) as HTMLElement;
    renderHook(() => useSectionHighlight());
    act(() => {
      getLatestObserver().simulateIntersection(true);
    });
    expect(aboutHeading).toHaveClass(HIGHLIGHT_CLASS);

    // Act: click the (unmarked) Hero anchor while #about is still highlighted
    clickAnchorWithHref("#hero");

    // Assert: the stale highlight was cleared even though the new target is a no-op
    expect(aboutHeading).not.toHaveClass(HIGHLIGHT_CLASS);

    // Advancing time fully should not resurrect the cancelled highlight
    act(() => {
      jest.advanceTimersByTime(HIGHLIGHT_DURATION_MS);
    });
    expect(aboutHeading).not.toHaveClass(HIGHLIGHT_CLASS);
  });

  it("cancels the highlight on the previously active heading when a new trigger fires", () => {
    // Arrange: highlight #about
    setHashSilently("#about");
    const aboutHeading = document.querySelector(
      "#about [data-section-heading]",
    ) as HTMLElement;
    renderHook(() => useSectionHighlight());
    act(() => {
      getLatestObserver().simulateIntersection(true);
    });
    expect(aboutHeading).toHaveClass(HIGHLIGHT_CLASS);

    // Act: trigger a new target while #about is still highlighted
    setHashSilently("#projects");
    act(() => {
      window.dispatchEvent(new Event("hashchange"));
    });

    // Assert: the previous heading's highlight was cancelled immediately
    expect(aboutHeading).not.toHaveClass(HIGHLIGHT_CLASS);

    const projectsHeading = document.querySelector(
      "#projects [data-section-heading]",
    ) as HTMLElement;
    act(() => {
      getLatestObserver().simulateIntersection(true);
    });
    expect(projectsHeading).toHaveClass(HIGHLIGHT_CLASS);

    // Advancing time fully should not resurrect the cancelled first heading
    act(() => {
      jest.advanceTimersByTime(HIGHLIGHT_DURATION_MS);
    });
    expect(aboutHeading).not.toHaveClass(HIGHLIGHT_CLASS);
    expect(projectsHeading).not.toHaveClass(HIGHLIGHT_CLASS);
  });

  it("disconnects the observer and never adds the highlight class if intersection never happens within the safety timeout", () => {
    // Arrange
    setHashSilently("#about");
    const heading = document.querySelector(
      "#about [data-section-heading]",
    ) as HTMLElement;
    renderHook(() => useSectionHighlight());
    const observer = getLatestObserver();

    // Act: the section never comes into view
    act(() => {
      jest.advanceTimersByTime(OBSERVER_SAFETY_MS);
    });

    // Assert
    expect(observer.disconnect).toHaveBeenCalled();
    expect(heading).not.toHaveClass(HIGHLIGHT_CLASS);
  });

  it("removes listeners, disconnects observers, and clears any active highlight on unmount", () => {
    // Arrange
    setHashSilently("#about");
    const heading = document.querySelector(
      "#about [data-section-heading]",
    ) as HTMLElement;
    const { unmount } = renderHook(() => useSectionHighlight());
    const observer = getLatestObserver();
    act(() => {
      observer.simulateIntersection(true);
    });
    expect(heading).toHaveClass(HIGHLIGHT_CLASS);

    // Act
    act(() => {
      unmount();
    });

    // Assert: highlight cleared and observer disconnected immediately
    expect(heading).not.toHaveClass(HIGHLIGHT_CLASS);
    expect(observer.disconnect).toHaveBeenCalled();

    const observerCountAfterUnmount = MockIntersectionObserver.instances.length;

    // Act: further hashchange/click events after unmount must not error or
    // create new observers, since listeners should have been removed
    setHashSilently("#projects");
    expect(() => {
      act(() => {
        window.dispatchEvent(new Event("hashchange"));
      });
    }).not.toThrow();

    expect(() => {
      clickAnchorWithHref("#projects");
    }).not.toThrow();

    expect(MockIntersectionObserver.instances.length).toBe(
      observerCountAfterUnmount,
    );

    // Act: no lingering timers should reintroduce the highlight class
    act(() => {
      jest.advanceTimersByTime(HIGHLIGHT_DURATION_MS + OBSERVER_SAFETY_MS);
    });
    expect(heading).not.toHaveClass(HIGHLIGHT_CLASS);
  });
});
