## Quickstart for TanStack Router and Upstash Workflow

```sh
npx @upstash/qstash-cli dev
```

Update the .env if not already, copy the .env.example to .env and replace the values with those shown in the qstash cli.

then in another terminal start up the app:

```sh
npm run dev
```

then test the workflow:

```sh
npx tsx test-workflow.ts
```

## Notes

Built [/src/utils/upstash-serve.ts](src/utils/upstash-serve.ts) to wrap workflows like the wrappers from https://github.com/upstash/workflow-js/blob/main/platforms/nextjs.ts and used the docs from

The main workflow code is in [src/routes/api/workflows/test.ts](src/routes/api/workflows/test.ts)
