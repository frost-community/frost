import { Button } from "@mantine/core";
import { Link, createFileRoute } from "@tanstack/react-router";

import { BACKEND_EJS_VARIABLE_KEYS } from "@/staticDataRouteOption";

export const Route = createFileRoute("/login")({
  component: Login,
  staticData: {
    openGraph: {
      title: `<%= ${BACKEND_EJS_VARIABLE_KEYS.siteName} + ' | Login' %>`,
      type: "website",
      description: "Login page",
    },
  },
});

export function Login() {
  return (
    <>
      <p>Login Page</p>
      <Link to="/">
        <Button>Top</Button>
      </Link>
    </>
  );
}
