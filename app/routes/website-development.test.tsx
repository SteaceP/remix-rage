// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import WebsiteDevelopment, { meta } from "./website-development";

describe("Route: /website-development", () => {
    it("exports meta with page title and description", () => {
        // @ts-expect-error Mocking MetaFunction args
        const m = meta({});
        expect(m).toBeDefined();
        expect(m![0]).toHaveProperty("title", "Website Development Services — Code Rage");
    });

    it("renders page heading and web development capabilities", () => {
        render(
            <MemoryRouter>
                <WebsiteDevelopment />
            </MemoryRouter>
        );

        expect(screen.getByRole("heading", { name: /Professional Website Development/i })).toBeDefined();
        expect(screen.getByText("Modern Tech Stack")).toBeDefined();
        expect(screen.getByText("Mobile-First & Responsive")).toBeDefined();
        expect(screen.getByText("SEO & Semantic Markup")).toBeDefined();
    });

    it("renders contact links with Website Development service param", () => {
        render(
            <MemoryRouter>
                <WebsiteDevelopment />
            </MemoryRouter>
        );

        const links = screen.getAllByRole("link");
        const contactLinks = links.filter((l) =>
            l.getAttribute("href")?.includes("/contact?service=Website%20Development")
        );
        expect(contactLinks.length).toBeGreaterThan(0);
    });
});
