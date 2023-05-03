import type { LinksFunction, LoaderFunction } from "@remix-run/node"
import type { V2_MetaFunction } from "@remix-run/react"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react"

import { Footer } from "./components/footer"
import { Header } from "./components/header"
import { getUser } from "./server/session.server"
import stylesheet from "./tailwind.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
]

export const meta: V2_MetaFunction = () => [
  {
    charset: "utf-8",
  },
  {
    title: "Hive Mind Tales",
  },
  {
    name: "viewport",
    content:
      "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
  },
]

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)

  return {
    user,
  }
}

// type ContextType = { user: User | null }

// export function useUser() {
//   return useOutletContext<ContextType>()
// }

export default function App() {
  const { user } = useLoaderData<ReturnType<typeof loader>>()
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-yellow-50 text-slate-900">
        <div className="mx-auto grid min-h-screen max-w-8xl grid-cols-1 grid-rows-layout px-6">
          <Header user={user} />
          <main className="h-full">
            <Outlet />
          </main>
          <Footer />
        </div>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
