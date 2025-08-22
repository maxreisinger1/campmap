import { uid, clamp } from "../../utils/helpers";

describe("helpers", () => {
  describe("uid", () => {
    test("generates a unique identifier", () => {
      const id1 = uid();
      const id2 = uid();

      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
    });

    test("generates string with expected format", () => {
      const id = uid();
      expect(typeof id).toBe("string");
      expect(id).toMatch(/^[a-z0-9]+-[a-z0-9]{6}$/);
    });

    test("generates multiple unique ids", () => {
      const ids = Array.from({ length: 100 }, () => uid());
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(100);
    });
  });

  describe("clamp", () => {
    test("returns value when within range", () => {
      expect(clamp(5, 1, 10)).toBe(5);
      expect(clamp(1, 1, 10)).toBe(1);
      expect(clamp(10, 1, 10)).toBe(10);
    });

    test("clamps to minimum when below range", () => {
      expect(clamp(-5, 1, 10)).toBe(1);
      expect(clamp(0.5, 1, 10)).toBe(1);
    });

    test("clamps to maximum when above range", () => {
      expect(clamp(15, 1, 10)).toBe(10);
      expect(clamp(100, 1, 10)).toBe(10);
    });

    test("works with decimal values", () => {
      expect(clamp(2.5, 1.1, 3.7)).toBe(2.5);
      expect(clamp(0.5, 1.1, 3.7)).toBe(1.1);
      expect(clamp(4.0, 1.1, 3.7)).toBe(3.7);
    });

    test("works with negative values", () => {
      expect(clamp(-2, -5, -1)).toBe(-2);
      expect(clamp(-10, -5, -1)).toBe(-5);
      expect(clamp(0, -5, -1)).toBe(-1);
    });
  });
});
