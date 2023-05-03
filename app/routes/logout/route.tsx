import type { LoaderFunction } from "@remix-run/server-runtime"
import { redirect } from "@remix-run/server-runtime"

import { createLogoutCookie } from "~/app/server/session.server"

export const loader: LoaderFunction = async ({ request }) => {
  return redirect("/login", {
    headers: {
      "Set-Cookie": await createLogoutCookie(request),
    },
  })
}
