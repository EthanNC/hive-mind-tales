import type { StackContext } from "sst/constructs"
import { Config } from "sst/constructs"

export function Database(ctx: StackContext) {
  const DATABASE_URL = new Config.Secret(ctx.stack, "DATABASE_URL")

  const PLANETSCALE_HOST = new Config.Secret(ctx.stack, "PLANETSCALE_HOST")
  const PLANETSCALE_USERNAME = new Config.Secret(
    ctx.stack,
    "PLANETSCALE_USERNAME",
  )
  const PLANETSCALE_PASSWORD = new Config.Secret(
    ctx.stack,
    "PLANETSCALE_PASSWORD",
  )

  return {
    DATABASE_URL,
    PLANETSCALE_HOST,
    PLANETSCALE_USERNAME,
    PLANETSCALE_PASSWORD,
  }
}
