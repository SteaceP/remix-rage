import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [tsconfigPaths()],
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
