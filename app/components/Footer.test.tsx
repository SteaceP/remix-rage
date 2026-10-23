// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Footer from "./Footer";

describe("<Footer />", () => {
    it("renders brand logo linking to home", () => {
        render(
            <MemoryRouter>
                <Footer />
            </MemoryRouter>
        );

        const logoImg = screen.getByAltText("Code Rage");
        expect(logoImg).toBeDefined();
        const logoLink = logoImg.closest("a");
        expect(logoLink?.getAttribute("href")).toBe("/");
    });

    it("renders all core service navigation links", () => {
        render(
            <MemoryRouter>
                <Footer />
            </MemoryRouter>
        );

        const services = [
            { text: "Website Development", href: "/website-development" },
            { text: "Cross-Platform Apps", href: "/cross-platform-apps" },
            { text: "Computer Repair & Custom PCs", href: "/computer-repair" },
            { text: "Family Tech Support", href: "/family-support" },
        ];

        for (const item of services) {
            const link = screen.getByRole("link", { name: item.text });
            expect(link.getAttribute("href")).toBe(item.href);
        }
    });

    it("renders contact link and external social media links", () => {
        render(
            <MemoryRouter>
                <Footer />
            </MemoryRouter>
        );

        const contactLink = screen.getByRole("link", { name: /Contact Code Rage/i });
        expect(contactLink.getAttribute("href")).toBe("/contact");

        const githubLink = screen.getByRole("link", { name: "GitHub" });
        expect(githubLink.getAttribute("href")).toBe("https://github.com/SteaceP");
        expect(githubLink.getAttribute("target")).toBe("_blank");
        expect(githubLink.getAttribute("rel")).toContain("noopener");

        const twitterLink = screen.getByRole("link", { name: "Twitter" });
        expect(twitterLink.getAttribute("href")).toBe("https://twitter.com/PaquetteSteacy");

        const facebookLink = screen.getByRole("link", { name: "Facebook" });
        expect(facebookLink.getAttribute("href")).toBe("https://facebook.com/steacyp");
    });

    it("renders copyright notice containing current year", () => {
        render(
            <MemoryRouter>
                <Footer />
            </MemoryRouter>
        );

        const currentYear = new Date().getFullYear().toString();
        const copyright = screen.getByText(new RegExp(`${currentYear}.*Code Rage.*All rights reserved`));
        expect(copyright).toBeDefined();
    });
});
