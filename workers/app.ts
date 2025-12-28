import { createRequestHandler } from "react-router";

let requestHandler: ReturnType<typeof createRequestHandler>;

function getRequestHandler() {
  if (!requestHandler) {
    requestHandler = createRequestHandler(
      () => import("virtual:react-router/server-build"),
      import.meta.env.MODE
    );
  }
  return requestHandler;
}

export default {
  async fetch(request, env, ctx) {
    const handler = getRequestHandler();
    return handler(request, {
      cloudflare: {
        env,
        ctx,
        cf: request.cf as any,
        caches: caches as any,
      },
    });
  },
} satisfies ExportedHandler<Env>;
