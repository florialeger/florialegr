import '@testing-library/jest-dom/vitest';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

Object.defineProperty(navigator, 'clipboard', {
  configurable: true,
  value: {
    writeText: async () => {},
  },
});

window.scrollTo = () => {};

class MockIntersectionObserver {
  observe() {}

  unobserve() {}

  disconnect() {}
}

window.IntersectionObserver = MockIntersectionObserver;
