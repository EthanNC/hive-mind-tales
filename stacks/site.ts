import { StackContext, use } from "sst/constructs"
import { RemixSite } from "sst/constructs"

import { Api } from "./api"

export function Site(ctx: StackContext) {
  const api = use(Api)
  const site = new RemixSite(ctx.stack, "site", {
    runtime: "nodejs16.x",
    buildCommand: "pnpm remix build",
    customDomain:
      ctx.app.stage === "production"
        ? {
            domainName: "hivemindtales.com",
            hostedZone: "hivemindtales.com",
            domainAlias: "www.hivemindtales.com",
          }
        : undefined,
    environment: {
      API_URL: api.url,
    },
    waitForInvalidation: ctx.app.stage === "production",
  })
  ctx.stack.addOutputs({
    url: site.url ?? "http://localhost:3000",
  })
}
