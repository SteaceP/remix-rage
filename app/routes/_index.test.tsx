// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Index, { headers, meta } from "./_index";

describe("Route: / (_index)", () => {
    it("exports headers with api-catalog Link", () => {
        const h = headers();
        expect(h.Link).toContain('</.well-known/api-catalog>; rel="api-catalog"');
    });

    it("exports meta with page title and description", () => {
        // @ts-expect-error Mocking empty MetaArgs
        const m = meta({});
        expect(m).toHaveLength(2);
        expect(m[0]).toHaveProperty("title", "Code Rage — Software Engineering & Tech Support Services");
    });

    it("renders the hero headline and service sections", () => {
        render(
            <MemoryRouter>
                <Index />
            </MemoryRouter>
        );

        expect(screen.getByText("Website Development")).toBeDefined();
        expect(screen.getByText("Cross-Platform Apps")).toBeDefined();
    });

    it("switches service track tabs when clicked", () => {
        render(
            <MemoryRouter>
                <Index />
            </MemoryRouter>
        );

        const hardwareTab = screen.getByRole("button", {
            name: /Hardware & Care/i,
        });
        fireEvent.click(hardwareTab);

        expect(screen.getByText("Complete Hardware & OS Diagnostic")).toBeDefined();
    });
});
