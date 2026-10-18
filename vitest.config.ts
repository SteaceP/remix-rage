import { defineConfig } from "vitest/config";
export default defineConfig({
    resolve: {
        alias: {
            "~": new URL("./app", import.meta.url).pathname,
        },
    },
    test: {
        globals: true,
        environment: "node",
        include: ["app/**/*.test.ts", "app/**/*.test.tsx"],
        exclude: ["node_modules", "build"],
        coverage: {
            provider: "v8",
            include: ["app/utils/**/*.ts"],
            exclude: ["**/*.test.ts"],
        },
    },
});
