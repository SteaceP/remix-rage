import { reactRouter } from "@react-router/dev/vite";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  // Load env file based on mode (development, production)
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      reactRouter(),
      tsconfigPaths(),
    ],
    server: {
      host: "0.0.0.0",
      port: 5173,
      strictPort: false,
    },
    // Expose environment variables to the app (both client and server)
    define: {
      'import.meta.env.CSRF_SECRET': JSON.stringify(env.CSRF_SECRET),
      'import.meta.env.BREVO_API_KEY': JSON.stringify(env.BREVO_API_KEY),
    },
  };
});

