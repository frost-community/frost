import { createFileRoute } from "@tanstack/react-router";

import { BACKEND_EJS_VARIABLE_KEYS } from "@/staticDataRouteOption";

export const Route = createFileRoute("/login")({
  staticData: {
    openGraph: {
      title: `<%= ${BACKEND_EJS_VARIABLE_KEYS.siteName} + ' | Login' %>`,
      type: "website",
      description: "Login page",
    },
  },
});
