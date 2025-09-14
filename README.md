## Quickstart for TanStack Router and Upstash Workflow

```sh
npx @upstash/qstash-cli dev
```

then in another terminal start up the app:

```sh
npm run dev
```

then test the workflow:

```sh
npx tsx test-workflow.ts
```

## Notes

Built `./src/utils/upstash-serve.ts` to wrap workflows like the wrappers from https://github.com/upstash/workflow-js/blob/main/platforms/nextjs.ts and used the docs from

The main workflow code is in [src/routes/api/workflows/test.ts](src/routes/api/workflows/test.ts)
