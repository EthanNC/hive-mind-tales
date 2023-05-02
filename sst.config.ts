import type { SSTConfig } from "sst"

import { Api } from "./stacks/api"
import { Authentication } from "./stacks/authentication"
import { Bus } from "./stacks/bus"
import { Database } from "./stacks/database"
import { OpenGraph } from "./stacks/open-graph"
import { Site } from "./stacks/site"

export default {
  config(input) {
    return {
      name: "hmt",
      region: "us-east-1",
    }
  },
  stacks(app) {
    if (app.stage !== "production") {
      app.setDefaultRemovalPolicy("destroy")
    }

    app.setDefaultFunctionProps({
      runtime: "nodejs16.x",
      nodejs: {
        format: "esm",
      },
      // environment: {
      //   API_URL: api.url,
      // },
      memorySize: "512 MB",
      logRetention: "one_day",
    })

    app.stack(Database)
    app.stack(Bus)
    app.stack(Api)
    app.stack(Authentication)
    // app.stack(OpenGraph)
    app.stack(Site)
  },
} satisfies SSTConfig
