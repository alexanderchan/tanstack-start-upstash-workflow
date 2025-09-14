import { Client } from "@upstash/workflow";
import { nanoid } from "nanoid";

// const URL = "https://8e0df10d8c86.ngrok-free.app";
const URL = "http://localhost:3000";
async function main() {
  try {
    const client = new Client({
      token: process.env.QSTASH_TOKEN,
      baseUrl: "http://127.0.0.1:8080",
    });

    const { workflowRunId } = await client.trigger({
      url: URL + "/api/workflows/test",
      body: {
        orderId: "12345",
      }, // optional body
      //   headers: { ... },             // optional headers
      workflowRunId: "my-workflow" + nanoid(), // optional workflow run id
      retries: 3, // optional retries in the initial request
      //   delay: "10s"                  // optional delay value
      //   failureUrl: "https://<YOUR_FAILURE_URL>", // optional failure url
      //   useFailureFunction: true,     // whether a failure function is defined in the endpoint
      //   flowControl: { ... }          // optional flow control
    });

    console.log(workflowRunId);
  } catch (e) {
    console.error(e);
  }
}

main();
