import { describe, expect, it } from "vitest";
import * as components from "./components";
import * as layout from "./layout";
import * as sections from "./sections";

describe("styles design system", () => {
    describe("sections", () => {
        const expectedSections = [
            "hero",
            "homeHero",
            "homeFeatures",
            "homeServices",
            "homeCta",
            "homeLayout",
            "features",
            "services",
            "cta",
            "page",
            "serviceCards",
            "pricing",
            "utilities",
        ] as const;

        it("exports all required section style objects", () => {
            expectedSections.forEach((name) => {
                const section = (sections as Record<string, any>)[name];
                expect(section, `sections.${name} should be defined`).toBeDefined();
                expect(typeof section).toBe("object");
            });
        });

        it("contains non-empty class strings without undefined/null", () => {
            expectedSections.forEach((name) => {
                const section = (sections as Record<string, any>)[name];
                Object.entries(section).forEach(([key, val]) => {
                    expect(typeof val, `${name}.${key} should be a string`).toBe("string");
                    expect((val as string).trim().length, `${name}.${key} should not be empty`).toBeGreaterThan(0);
                    expect(val).not.toContain("undefined");
                    expect(val).not.toContain("null");
                });
            });
        });
    });

    describe("components", () => {
        const expectedComponents = ["navigation", "cards", "footer", "contactStyles"] as const;

        it("exports all component style objects with valid class strings", () => {
            expectedComponents.forEach((name) => {
                const comp = (components as Record<string, any>)[name];
                expect(comp, `components.${name} should be defined`).toBeDefined();
                expect(typeof comp).toBe("object");

                Object.entries(comp).forEach(([key, val]) => {
                    expect(typeof val, `${name}.${key} should be a string`).toBe("string");
                    expect((val as string).trim().length, `${name}.${key} should not be empty`).toBeGreaterThan(0);
                    expect(val).not.toContain("undefined");
                    expect(val).not.toContain("null");
                });
            });
        });
    });

    describe("layout", () => {
        it("exports layout and header with valid class strings", () => {
            expect(layout.layout).toBeDefined();
            expect(typeof layout.layout).toBe("object");
            Object.entries(layout.layout).forEach(([key, val]) => {
                expect(typeof val).toBe("string");
                expect(val.trim().length).toBeGreaterThan(0);
                expect(val).not.toContain("undefined");
                expect(val).not.toContain("null");
            });

            expect(layout.header).toBeDefined();
            expect(typeof layout.header).toBe("object");
            Object.entries(layout.header).forEach(([key, val]) => {
                expect(typeof val).toBe("string");
                expect(val.trim().length).toBeGreaterThan(0);
                expect(val).not.toContain("undefined");
                expect(val).not.toContain("null");
            });
        });
    });
});
