import type { StackContext } from "sst/constructs"
import { Api as ApiGateway } from "sst/constructs"
import { use } from "sst/constructs"

import { Bus } from "./bus"
import { Database } from "./database"

export function Api({ stack }: StackContext) {
  const { DATABASE_URL } = use(Database)
  const { bus } = use(Bus)
  const api = new ApiGateway(stack, "api", {
    // customDomain: {
    //   domainName:
    //     ctx.app.stage === "production"
    //       ? "api.hivemindtales.com"
    //       : `api.${ctx.app.stage}.hivemindtales.com`,
    //   hostedZone: "hivemindtales.com",
    // },
    defaults: {
      function: {
        bind: [bus, DATABASE_URL],
      },
    },
    routes: {
      // We need to define GET and POST instead of ANY otherwise our CORS
      // policy will not work.
      // https://github.com/trpc/trpc/discussions/2095#discussioncomment-3116235
      "GET /trpc/{proxy+}": "server/functions/trpc.handler",
      "POST /trpc/{proxy+}": "server/functions/trpc.handler",
    },
  })

  stack.addOutputs({
    API: api.url,
  })

  return api
}
