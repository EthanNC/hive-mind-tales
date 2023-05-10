import { connect } from "@planetscale/database"
import { drizzle } from "drizzle-orm/planetscale-serverless"
import { migrate as mig } from "drizzle-orm/planetscale-serverless/migrator"
import { Config } from "sst/node/config"
import { fetch } from "undici"

const connection = connect({
  host: Config.PLANETSCALE_HOST,
  username: Config.PLANETSCALE_USERNAME,
  password: Config.PLANETSCALE_PASSWORD,
  fetch,
})

export const db = drizzle(connection)

export const migrate = async (path: string) => {
  return mig(db, { migrationsFolder: path })
}
