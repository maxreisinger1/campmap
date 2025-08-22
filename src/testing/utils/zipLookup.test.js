import { lookupZip } from "../../utils/zipLookup";

// Mock fetch globally
global.fetch = jest.fn();

describe("zipLookup", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test("successfully looks up valid ZIP code", async () => {
    const mockResponse = {
      places: [
        {
          "place name": "Austin",
          "state abbreviation": "TX",
          latitude: "30.2672",
          longitude: "-97.7431",
        },
      ],
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await lookupZip("73301");

    expect(fetch).toHaveBeenCalledWith("https://api.zippopotam.us/us/73301");
    expect(result).toEqual({
      city: "Austin",
      state: "TX",
      lat: 30.2672,
      lon: -97.7431,
    });
  });

  test("throws error for failed API request", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(lookupZip("00000")).rejects.toThrow("ZIP lookup failed");
  });

  test("throws error when no places found", async () => {
    const mockResponse = { places: [] };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    await expect(lookupZip("00000")).rejects.toThrow("ZIP not found");
  });

  test("throws error when places is undefined", async () => {
    const mockResponse = {};

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    await expect(lookupZip("00000")).rejects.toThrow("ZIP not found");
  });

  test("handles network errors", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));

    await expect(lookupZip("73301")).rejects.toThrow("Network error");
  });

  test("handles JSON parsing errors", async () => {
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
    });

    await expect(lookupZip("73301")).rejects.toThrow("Invalid JSON");
  });

  test("converts latitude and longitude to numbers", async () => {
    const mockResponse = {
      places: [
        {
          "place name": "Test City",
          "state abbreviation": "TX",
          latitude: "40.7128",
          longitude: "-74.0060",
        },
      ],
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await lookupZip("10001");

    expect(typeof result.lat).toBe("number");
    expect(typeof result.lon).toBe("number");
    expect(result.lat).toBe(40.7128);
    expect(result.lon).toBe(-74.006);
  });
});
