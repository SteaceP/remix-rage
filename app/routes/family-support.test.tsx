// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import FamilySupport, { meta } from "./family-support";

describe("Route: /family-support", () => {
    it("exports meta with page title and description", () => {
        // @ts-expect-error Mocking MetaFunction args
        const m = meta({});
        expect(m).toBeDefined();
        expect(m![0]).toHaveProperty("title", "Family Tech Support — Code Rage");
    });

    it("renders page heading and support service sections", () => {
        render(
            <MemoryRouter>
                <FamilySupport />
            </MemoryRouter>
        );

        expect(screen.getByRole("heading", { name: /Family Tech Support/i })).toBeDefined();
        expect(screen.getByText("Family Tech Setup")).toBeDefined();
        expect(screen.getByText("Ongoing Support")).toBeDefined();
        expect(screen.getByText("Security & Safety")).toBeDefined();
        expect(screen.getByText("Training & Education")).toBeDefined();
    });

    it("renders contact links for Family Tech Support service", () => {
        render(
            <MemoryRouter>
                <FamilySupport />
            </MemoryRouter>
        );

        const links = screen.getAllByRole("link");
        const contactLinks = links.filter((l) =>
            l.getAttribute("href")?.includes("/contact?service=Family%20Tech%20Support")
        );
        expect(contactLinks.length).toBeGreaterThan(0);
    });
});
