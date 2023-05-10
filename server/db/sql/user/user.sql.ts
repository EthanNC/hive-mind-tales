import {
  index,
  mysqlTable,
  primaryKey,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core"

import { id } from "../util"

export const user = mysqlTable(
  "user",
  {
    id: varchar("id", { length: 191 }).notNull(),
    email: varchar("email", { length: 191 }).notNull(),
  },

  //   (user) => ({
  //     email: index("user__email__idx").on(user.email),
  //   }),
)
