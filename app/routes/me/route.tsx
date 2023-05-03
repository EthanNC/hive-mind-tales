//check if logged in

import { useLoaderData } from "@remix-run/react"
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime"
import { redirect } from "@remix-run/server-runtime"

import { apiClient } from "~/app/server/api-client.server"
import { createLogoutCookie } from "~/app/server/session.server"

export const loader: LoaderFunction = async ({ request }) => {
  //check if logged in
  const user = await apiClient({
    request,
    auth: true,
    thunk: (client) => client.users.me.query(),
  })

  return {
    user,
  }
}

export default function Profile() {
  const { user } = useLoaderData<typeof loader>()

  return (
    <div>
      <h1>Profile</h1>
      <p>{user.username}</p>
    </div>
  )
}
