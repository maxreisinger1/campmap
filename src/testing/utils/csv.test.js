import { exportToCSV } from "../../utils/csv";

// Mock DOM methods
Object.defineProperty(document, "createElement", {
  value: jest.fn(() => ({
    href: "",
    download: "",
    click: jest.fn(),
    style: {},
  })),
});

Object.defineProperty(document.body, "appendChild", {
  value: jest.fn(),
});

Object.defineProperty(document.body, "removeChild", {
  value: jest.fn(),
});

Object.defineProperty(window, "URL", {
  value: {
    createObjectURL: jest.fn(() => "blob:url"),
  },
});

describe("exportToCSV", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("exports data to CSV with default filename", () => {
    const testData = [
      { name: "John Doe", email: "john@example.com", city: "Austin" },
      { name: "Jane Smith", email: "jane@example.com", city: "Dallas" },
    ];

    exportToCSV(testData);

    expect(document.createElement).toHaveBeenCalledWith("a");
    expect(document.body.appendChild).toHaveBeenCalled();
    expect(document.body.removeChild).toHaveBeenCalled();
  });

  test("exports data to CSV with custom filename", () => {
    const testData = [{ id: 1, value: "test" }];

    exportToCSV(testData, "custom_export.csv");

    const mockLink = document.createElement.mock.results[0].value;
    expect(mockLink.download).toBe("custom_export.csv");
  });

  test("handles empty array gracefully", () => {
    exportToCSV([]);

    // Should not create any elements for empty data
    expect(document.createElement).not.toHaveBeenCalled();
  });

  test("handles null/undefined data gracefully", () => {
    exportToCSV(null);
    exportToCSV(undefined);

    expect(document.createElement).not.toHaveBeenCalled();
  });

  test("properly escapes CSV values with quotes", () => {
    const testData = [
      { name: 'John "Johnny" Doe', description: 'A person with "quotes"' },
    ];

    // Spy on Blob constructor to check CSV content
    const originalBlob = global.Blob;
    const mockBlob = jest.fn();
    global.Blob = mockBlob;

    exportToCSV(testData);

    expect(mockBlob).toHaveBeenCalledWith(
      [expect.stringContaining('"John ""Johnny"" Doe"')],
      { type: "text/csv;charset=utf-8;" }
    );

    global.Blob = originalBlob;
  });

  test("handles values with null and undefined", () => {
    const testData = [
      { name: "John", value: null, other: undefined, empty: "" },
    ];

    const originalBlob = global.Blob;
    const mockBlob = jest.fn();
    global.Blob = mockBlob;

    exportToCSV(testData);

    // Should convert null/undefined to empty strings in quotes
    expect(mockBlob).toHaveBeenCalledWith(
      [expect.stringContaining('name,value,other,empty\n"John","","",""')],
      { type: "text/csv;charset=utf-8;" }
    );

    global.Blob = originalBlob;
  });

  test("creates proper CSV structure with headers and rows", () => {
    const testData = [
      { col1: "value1", col2: "value2" },
      { col1: "value3", col2: "value4" },
    ];

    const originalBlob = global.Blob;
    const mockBlob = jest.fn();
    global.Blob = mockBlob;

    exportToCSV(testData);

    const expectedCSV = 'col1,col2\n"value1","value2"\n"value3","value4"';
    expect(mockBlob).toHaveBeenCalledWith([expectedCSV], {
      type: "text/csv;charset=utf-8;",
    });

    global.Blob = originalBlob;
  });
});
