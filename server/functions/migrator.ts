import { ApiHandler } from "sst/node/api"

import { migrate } from "../db/drizzle"

export const handler = ApiHandler(async (_evt) => {
  const pathToMigrations = "server/db/migrations/"

  try {
    await migrate(pathToMigrations)
  } catch (e: any) {
    console.log(e)
    return {
      statusCode: 500,
      body: e.message,
    }
  }

  return {
    body: "Migrated!",
  }
})
