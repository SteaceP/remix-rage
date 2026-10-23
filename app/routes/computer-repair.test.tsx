// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import ComputerRepair, { meta } from "./computer-repair";

describe("Route: /computer-repair", () => {
    it("exports meta with page title and description", () => {
        // @ts-expect-error Mocking MetaFunction args
        const m = meta({});
        expect(m).toBeDefined();
        expect(m![0]).toHaveProperty("title", "Computer Repair Services — Code Rage");
    });

    it("renders page heading and core service offerings", () => {
        render(
            <MemoryRouter>
                <ComputerRepair />
            </MemoryRouter>
        );

        expect(screen.getByRole("heading", { name: /Professional Computer Repair/i })).toBeDefined();
        expect(screen.getByText("Hardware Repairs")).toBeDefined();
        expect(screen.getByText("Software Solutions")).toBeDefined();
        expect(screen.getByText("Performance Optimization")).toBeDefined();
        expect(screen.getByText("Custom PC Building")).toBeDefined();
    });

    it("renders diagnostic fee and link to contact form", () => {
        render(
            <MemoryRouter>
                <ComputerRepair />
            </MemoryRouter>
        );

        const links = screen.getAllByRole("link");
        const contactLinks = links.filter((l) =>
            l.getAttribute("href")?.includes("/contact?service=Computer%20Repair")
        );
        expect(contactLinks.length).toBeGreaterThan(0);
    });
});
