import { Button, Group, Image, Stack } from "@mantine/core";

import deleteParrotGif from "/deletedparrot.gif";

import { useToggle } from "@mantine/hooks";

export const DeleteParrot = () => {
  const [deleted, toggleDeleted] = useToggle();

  return (
    <>
      <Group justify="center">
        <Stack>
          <Image
            src={deleteParrotGif}
            h={100}
            w="auto"
            style={{
              visibility: deleted ? "hidden" : "visible",
            }}
            decoding="async"
          />
          <Button
            onClick={() => {
              toggleDeleted();
            }}
            size="md"
          >
            DeleteParrotを{deleted ? "Restore" : "Delete"}
          </Button>
        </Stack>
      </Group>
    </>
  );
};
