import { char } from "drizzle-orm/mysql-core"

export { createId } from "@paralleldrive/cuid2"
export const cuid = (name: string) => char(name, { length: 24 })
export const id = (name: string) => cuid(`${name}_id`).notNull()
