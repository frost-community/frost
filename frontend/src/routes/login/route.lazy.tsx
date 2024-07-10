import { createLazyFileRoute } from "@tanstack/react-router";

import { Login } from "./route";

export const Route = createLazyFileRoute("/login")({
  component: Login,
});
