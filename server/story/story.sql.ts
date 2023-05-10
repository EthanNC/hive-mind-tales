import { index, mysqlTable, primaryKey, varchar } from "drizzle-orm/mysql-core"

import { cuid } from "../db/sql/util"

export const story = mysqlTable(
  "story",
  {
    id: cuid("story_id"),
    title: varchar("title", { length: 255 }).notNull(),
    body: varchar("body", { length: 255 }).notNull(),
    createdAt: varchar("created_at", { length: 24 }).notNull(),
    createdBy: varchar("created_by", { length: 24 }),
  },
  (story) => ({
    primary: primaryKey(story.id),
    userIdIndex: index("story__user_id__idx").on(story.createdBy),
  }),
)
