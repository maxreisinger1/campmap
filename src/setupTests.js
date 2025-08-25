/**
 * @fileoverview Jest test setup configuration with mocks and global test utilities
 * @author Creator Camp Team
 * @version 1.0.0
 */

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom

import "@testing-library/jest-dom";
import "jest-canvas-mock";

/**
 * Global fetch mock for testing HTTP requests.
 * @type {jest.MockedFunction}
 */
global.fetch = jest.fn();

/**
 * Mock window.URL.createObjectURL for blob URL testing.
 * @type {jest.MockedFunction}
 */
global.URL.createObjectURL = jest.fn(() => "mocked-blob-url");

/**
 * Mock window.URL.revokeObjectURL for cleanup testing.
 * @type {jest.MockedFunction}
 */
global.URL.revokeObjectURL = jest.fn();

// Mock document methods for CSV tests
const mockElement = {
  click: jest.fn(),
  setAttribute: jest.fn(),
  style: {},
  href: "",
  download: "",
};

global.document.createElement = jest.fn((tagName) => {
  if (tagName === "a") {
    return {
      ...mockElement,
      href: "",
      download: "",
      click: jest.fn(),
    };
  }
  return mockElement;
});

global.document.body.appendChild = jest.fn();
global.document.body.removeChild = jest.fn();

// Polyfill ReadableStream for Node.js environment
global.ReadableStream = class ReadableStream {};

global.document.body.appendChild = jest.fn();
global.document.body.removeChild = jest.fn();

// Polyfill ReadableStream for Node.js environment
global.ReadableStream = class ReadableStream {
  constructor(source) {
    this.source = source;
    this.locked = false;
    this.reader = null;
  }

  getReader() {
    if (this.locked) {
      throw new TypeError("ReadableStream is locked");
    }
    this.locked = true;
    this.reader = new ReadableStreamReader(this);
    return this.reader;
  }

  cancel() {
    return Promise.resolve();
  }
};

class ReadableStreamReader {
  constructor(stream) {
    this.stream = stream;
    this.closed = new Promise((resolve) => {
      this._resolveClose = resolve;
    });
  }

  async read() {
    if (this.stream.source && this.stream.source.start) {
      const controller = new ReadableStreamController();
      try {
        this.stream.source.start(controller);
        if (controller.chunks.length > 0) {
          const value = controller.chunks.shift();
          return { value, done: false };
        }
      } catch (error) {
        throw error;
      }
    }
    return { value: undefined, done: true };
  }

  releaseLock() {
    this.stream.locked = false;
    this._resolveClose();
  }
}

class ReadableStreamController {
  constructor() {
    this.chunks = [];
  }

  enqueue(chunk) {
    this.chunks.push(chunk);
  }

  close() {
    // Controller is closed
  }

  error(error) {
    throw error;
  }
}

// TextEncoder and TextDecoder polyfills
global.TextEncoder = class TextEncoder {
  encode(str) {
    return new Uint8Array(Array.from(str).map((char) => char.charCodeAt(0)));
  }
};

global.TextDecoder = class TextDecoder {
  decode(bytes) {
    return Array.from(bytes)
      .map((byte) => String.fromCharCode(byte))
      .join("");
  }
};

// Blob constructor polyfill
global.Blob = class Blob {
  constructor(parts = [], options = {}) {
    this.parts = parts;
    this.type = options.type || "";
    this.size = parts.reduce((size, part) => size + (part.length || 0), 0);
  }
};

// Console suppression for specific warnings/errors we expect in tests
const originalConsoleError = console.error;
console.error = (...args) => {
  const message = args[0];
  if (
    typeof message === "string" &&
    (message.includes("ZIP lookup error:") ||
      message.includes("Warning: An update to TestComponent"))
  ) {
    // Suppress expected test console outputs
    return;
  }
  originalConsoleError.apply(console, args);
};

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock HTMLCanvasElement.getContext
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(() => ({ data: new Array(4) })),
  putImageData: jest.fn(),
  createImageData: jest.fn(() => []),
  setTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  stroke: jest.fn(),
  fill: jest.fn(),
  measureText: jest.fn(() => ({ width: 0 })),
  transform: jest.fn(),
  arc: jest.fn(),
  fillText: jest.fn(),
  strokeText: jest.fn(),
}));

// Add global test setup and polyfills

// Mock ReadableStream for Node.js environment
global.ReadableStream = class ReadableStream {
  constructor(source = {}) {
    this.source = source;
    this.locked = false;
  }

  getReader() {
    return {
      read: async () => {
        if (this.source.start && typeof this.source.start === "function") {
          let chunks = [];
          const controller = {
            enqueue: (chunk) => chunks.push(chunk),
            close: () => {},
            error: (error) => {
              throw error;
            },
          };
          try {
            this.source.start(controller);
            if (chunks.length > 0) {
              return { done: false, value: chunks[0] };
            }
          } catch (error) {
            throw error;
          }
        }
        return { done: true, value: undefined };
      },
    };
  }
};

// Mock TextEncoder/TextDecoder
global.TextEncoder = class TextEncoder {
  encode(text) {
    return new Uint8Array(Buffer.from(text, "utf8"));
  }
};

global.TextDecoder = class TextDecoder {
  decode(buffer) {
    return Buffer.from(buffer).toString("utf8");
  }
};

// Mock window.URL for blob creation in CSV tests
if (!global.URL) {
  global.URL = {
    createObjectURL: jest.fn(() => "blob:mock-url"),
    revokeObjectURL: jest.fn(),
  };
}

// Mock window.requestAnimationFrame for animation tests
global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 16));
global.cancelAnimationFrame = jest.fn((id) => clearTimeout(id));

// Mock ResizeObserver
global.ResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock scrollTo
global.scrollTo = jest.fn();

// Mock fetch for tests that need it
global.fetch = jest.fn();

// Mock Blob constructor
global.Blob = jest.fn((content, options) => ({
  content,
  options,
  size: content ? content.join("").length : 0,
  type: options?.type || "",
}));

// Mock document.createElement for CSV tests
const originalCreateElement = document.createElement;
document.createElement = jest.fn((tagName) => {
  if (tagName === "a") {
    return {
      href: "",
      download: "",
      click: jest.fn(),
      style: {},
    };
  }
  return originalCreateElement.call(document, tagName);
});

// Mock document body methods
document.body.appendChild = jest.fn();
document.body.removeChild = jest.fn();
