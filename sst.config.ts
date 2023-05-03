import type { SSTConfig } from "sst"

import { Api } from "./stacks/api"
import { Authentication } from "./stacks/authentication"
import { Bus } from "./stacks/bus"
import { Database } from "./stacks/database"
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
      memorySize: "512 MB",
      logRetention: "one_day",
    })

    app.stack(Database)
    app.stack(Bus)
    app.stack(Api)
    app.stack(Authentication)
    app.stack(Site)
  },
} satisfies SSTConfig
