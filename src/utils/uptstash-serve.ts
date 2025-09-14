// adapters/tanstack-start.ts
// Minimal TanStack Start adapter using ONLY public @upstash/workflow exports.
// No internal imports, no private types.

// Public SDK
import {
  serve as upstashServe,
  type RouteFunction,
  type PublicServeOptions,
} from "@upstash/workflow";

// Use exported types instead of inferring from Parameters<...>

/** TanStack Start method signature (server routes) */
type TanstackStartMethod = (args: { request: Request }) => Promise<Response>;

/** Serve a single workflow on a TanStack Start server route. */
export function serve<TInitialPayload = unknown, TResult = unknown>(
  routeFunction: RouteFunction<TInitialPayload, TResult>,
  options?: PublicServeOptions<TInitialPayload>
): { POST: TanstackStartMethod } {
  // Core upstash serve returns { handler(request: Request): Promise<Response> }
  const { handler } = upstashServe<TInitialPayload, Request, Response, TResult>(
    routeFunction,
    options
  );
  return {
    POST: async ({ request }) => handler(request),
  };
}

/** Lightweight holder so you can predeclare and compose multiple workflows. */
export function createWorkflow<TInitialPayload = unknown, TResult = unknown>(
  routeFunction: RouteFunction<TInitialPayload, TResult>,
  options?: PublicServeOptions<TInitialPayload>
) {
  return { routeFunction, options } as const;
}

/**
 * Serve many workflows under one TanStack route, dispatching by pathname.
 * Each entry gets a full URL (no rewriting) so Upstash keeps correct absolute URLs.
 */
export function serveMany(
  workflows: Array<{
    /** Absolute or route-relative path you’ll POST to (e.g. "/workflows/approve") */
    url: string;
    workflow: ReturnType<typeof createWorkflow>;
  }>,
  opts?: {
    /** Optional: 404/405 messages, or custom not-found behavior */
    notFoundMessage?: string;
    methodNotAllowedMessage?: string;
  }
): { POST: TanstackStartMethod } {
  // Normalize to a quick lookup map
  const table = new Map<string, ReturnType<typeof upstashServe>>();
  for (const { url, workflow } of workflows) {
    const { routeFunction, options } = workflow;
    table.set(url, upstashServe(routeFunction as any, options as any));
  }

  return {
    POST: async ({ request }) => {
      const urlObj = new URL(request.url);
      const path = urlObj.pathname;

      // Exact match first
      let target = table.get(path);

      // If you want prefix-based matching for nested paths, uncomment:
      // if (!target) {
      //   const key = [...table.keys()].find(k => path === k || path.startsWith(k + "/"));
      //   if (key) target = table.get(key)!;
      // }

      if (!target) {
        return new Response(
          opts?.notFoundMessage ?? "Workflow route not found",
          { status: 404 }
        );
      }

      return target.handler(request);
    },
  };
}
