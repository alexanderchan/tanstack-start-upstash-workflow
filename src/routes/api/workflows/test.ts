import { createServerFileRoute } from "@tanstack/react-start/server";
import { RouteFunction } from "@upstash/workflow";
import { serve } from "~/utils/uptstash-serve";

// export const Route = createFileRoute("/api/workflows/test")({
//   component: RouteComponent,
// });

const testWorkflow: RouteFunction<{ orderId: string }, { ok: true }> = async (
  ctx
) => {
  // ctx.requestPayload, ctx.run(...), ctx.call(...), ctx.waitForEvent(...), etc.
  await ctx.run("validate", async () => {
    console.log("validating..");
  });

  await ctx.run("doSomething", async () => {
    // business logic
    console.log("do something");
  });

  return { ok: true };
};

export const ServerRoute = createServerFileRoute("/api/workflows/test").methods(
  //   {
  //     GET: async ({ request }) => {
  //       return new Response("Hello, World!");
  //     },
  //   }
  serve(testWorkflow)
);
