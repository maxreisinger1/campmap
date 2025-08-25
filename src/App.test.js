// App.test.js
// Unit tests for the main App component
// Uses Jest and React Testing Library
// Author: Bart Tynior
// Date: 2025-08-25
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/Loading…/i);
  expect(linkElement).toBeInTheDocument();
});
