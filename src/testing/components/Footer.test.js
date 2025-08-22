import { render, screen } from "@testing-library/react";
import Footer from "../../components/Footer";

describe("Footer", () => {
  test("renders copyright notice", () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(`© ${currentYear} Camp Studios — All vibes reserved.`)
    ).toBeInTheDocument();
  });

  test("renders roadmap items", () => {
    render(<Footer />);

    expect(screen.getByText(/Roadmap:/)).toBeInTheDocument();
    expect(screen.getByText("Global postcode geocoding")).toBeInTheDocument();
    expect(screen.getByText("Auth + DB (Supabase)")).toBeInTheDocument();
    expect(screen.getByText("Spam protection")).toBeInTheDocument();
    expect(screen.getByText("Public city pages")).toBeInTheDocument();
  });

  test("has correct styling classes", () => {
    render(<Footer />);

    const copyrightText = screen.getByText(/© \d{4} Camp Studios/);
    expect(copyrightText).toHaveClass("text-xs", "font-mono", "opacity-70");

    const roadmapText = screen.getByText(/Roadmap:/);
    expect(roadmapText).toHaveClass("text-xs", "font-mono");
  });

  test("roadmap items have underline decoration", () => {
    render(<Footer />);

    const roadmapItems = [
      "Global postcode geocoding",
      "Auth + DB (Supabase)",
      "Spam protection",
      "Public city pages",
    ];

    roadmapItems.forEach((item) => {
      const element = screen.getByText(item);
      expect(element).toHaveClass("underline");
    });
  });

  test("renders footer content", () => {
    render(<Footer />);

    expect(screen.getByText(/© \d{4} Camp Studios/)).toBeInTheDocument();
    expect(screen.getByText(/Roadmap:/)).toBeInTheDocument();
  });
});
