import { Button, Group } from "@mantine/core";
import { Link, createFileRoute } from "@tanstack/react-router";

import { DeleteParrot } from "./-components/DeleteParrot";

export const Route = createFileRoute("/")({
  component: Home,
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
