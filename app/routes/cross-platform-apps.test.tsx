// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import CrossPlatformApps, { meta } from "./cross-platform-apps";

describe("Route: /cross-platform-apps", () => {
    it("exports meta with page title and description", () => {
        const m = meta({} as any);
        expect(m).toBeDefined();
        expect(m![0]).toHaveProperty("title", "Cross-Platform App Development — Code Rage");
    });

    it("renders page heading and cross-platform offerings", () => {
        render(
            <MemoryRouter>
                <CrossPlatformApps />
            </MemoryRouter>
        );

        expect(screen.getByRole("heading", { name: /Cross-Platform App Development/i })).toBeDefined();
        expect(screen.getByText("Mobile Apps")).toBeDefined();
        expect(screen.getByText("Desktop Applications")).toBeDefined();
        expect(screen.getByText("Web Applications (PWA)")).toBeDefined();
    });

    it("renders call-to-action buttons linking to contact route with service param", () => {
        render(
            <MemoryRouter>
                <CrossPlatformApps />
            </MemoryRouter>
        );

        const links = screen.getAllByRole("link");
        const contactLinks = links.filter((l) =>
            l.getAttribute("href")?.includes("/contact?service=Cross-Platform%20App")
        );
        expect(contactLinks.length).toBeGreaterThan(0);
    });
});
