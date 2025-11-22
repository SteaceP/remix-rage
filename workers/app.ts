import { createRequestHandler } from "react-router";



const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);

export default {
  async fetch(request, env, ctx) {
    return requestHandler(request, {
      cloudflare: {
        env,
        ctx,
        cf: request.cf as any,
        caches: caches as any,
      },
    });
  },
} satisfies ExportedHandler<Env>;
