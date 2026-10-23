// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import App, { ErrorBoundary, links } from "./root";

describe("Root layout & error boundary", () => {
    it("exports links with manifest and Google fonts preconnects", () => {
        const l = links();
        expect(l.some((item) => "rel" in item && item.rel === "manifest")).toBe(true);
        expect(l.some((item) => "rel" in item && item.rel === "preconnect")).toBe(true);
        expect(l.some((item) => "rel" in item && item.rel === "stylesheet")).toBe(true);
    });

    it("renders App default outlet component", () => {
        const { container } = render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );
        expect(container).toBeDefined();
    });

    it("renders 404 error response properly in ErrorBoundary", () => {
        const error = {
            status: 404,
            statusText: "Not Found",
            data: null,
            internal: true,
        };

        render(
            <MemoryRouter>
                {/* @ts-expect-error Mocking Route.ErrorBoundaryProps */}
                <ErrorBoundary error={error} />
            </MemoryRouter>
        );

        expect(screen.getByText("Status // 404")).toBeDefined();
        expect(screen.getByRole("heading", { name: "Page not found" })).toBeDefined();
        expect(screen.getByText("The page you are looking for doesn't exist or has been moved.")).toBeDefined();
        expect(screen.getByRole("link", { name: "Return to Homepage" })).toBeDefined();
    });

    it("renders generic 500 RouteError response in ErrorBoundary", () => {
        const error = {
            status: 500,
            statusText: "Internal Server Error",
            data: null,
            internal: true,
        };

        render(
            <MemoryRouter>
                {/* @ts-expect-error Mocking Route.ErrorBoundaryProps */}
                <ErrorBoundary error={error} />
            </MemoryRouter>
        );

        expect(screen.getByText("Status // 500")).toBeDefined();
        expect(screen.getByRole("heading", { name: "Request error" })).toBeDefined();
        expect(screen.getByText("Internal Server Error")).toBeDefined();
    });

    it("renders standard Error object in ErrorBoundary", () => {
        const standardError = new Error("Database timeout");

        render(
            <MemoryRouter>
                {/* @ts-expect-error Mocking Route.ErrorBoundaryProps */}
                <ErrorBoundary error={standardError} />
            </MemoryRouter>
        );

        expect(screen.getByText("Status // Error")).toBeDefined();
        expect(screen.getByRole("heading", { name: "Something went wrong" })).toBeDefined();
    });
});
