import { Button, Group } from "@mantine/core";
import { Link, createFileRoute } from "@tanstack/react-router";

import { DeleteParrot } from "./-components/DeleteParrot";

import { BACKEND_EJS_VARIABLE_KEYS } from "@/staticDataRouteOption";

export const Route = createFileRoute("/")({
  component: Home,
  staticData: {
    openGraph: {
      title: `<%= ${BACKEND_EJS_VARIABLE_KEYS.siteName} %>`,
      type: "website",
      description: "Top",
    },
  },
});

function Home() {
  return (
    <>
      <DeleteParrot />
      <Group justify="center" mt="lg">
        <Button component={Link} to="/login">
          LOGIN
        </Button>
      </Group>
    </>
  );
}
