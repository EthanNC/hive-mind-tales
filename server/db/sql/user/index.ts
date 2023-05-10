import type { InferModel } from "drizzle-orm"
import { eq } from "drizzle-orm"

import { db } from "../../drizzle"
import { createId } from "../util"
import { user } from "./user.sql"

export * as User from "./"

export type UserType = InferModel<typeof user>

//create user props
export type UserProps = {
  email: string
  id?: string
}

// export const create = async (input: UserProps) => {
//   const id = input.id ?? createId()

//   await db.insert(user).values({
//     id,
//     email: input.email,
//     type: "user",
//     username: "bob",
//   })
//   return id
// }

export const fromID = async (id: string) =>
  await db.select().from(user).where(eq(user.id, id)).execute()
