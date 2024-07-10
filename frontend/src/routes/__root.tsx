import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import type { OpenGraphProtocolType } from "@/staticDataRouteOption";

import { Header } from "@/components/Header";

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
  staticData: {
    // RootRouteのOGP情報は使用しないが型定義上何かしら入れる必要がある
    openGraph: {
      title: "Don't Care",
      type: "Don't Care" as OpenGraphProtocolType,
      description: "Don't Care",
    },
  },
});
