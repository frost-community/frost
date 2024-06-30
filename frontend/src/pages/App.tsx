import {
  ActionIcon,
  Button,
  Group,
  Image,
  useMantineColorScheme,
} from "@mantine/core";

import deleteParrot from "/deletedparrot.gif";

import { useToggle } from "@mantine/hooks";
import { MoonStars, Sun } from "@phosphor-icons/react";

export const App = () => {
  const [deleted, toggleDeleted] = useToggle();

  return (
    <>
      <Group p="12" justify="flex-end">
        <ColorSchemeToggleButton />
      </Group>
      <Image
        src={deleteParrot}
        h={100}
        w="auto"
        style={{
          visibility: deleted ? "hidden" : "visible",
        }}
      />
      <Button
        onClick={() => {
          toggleDeleted();
        }}
      >
        DeleteParrotを{deleted ? "Restore" : "Delete"}
      </Button>
    </>
  );
};

const ColorSchemeToggleButton = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <ActionIcon
      color="yellow"
      variant="light"
      size="lg"
      radius="xl"
      onClick={toggleColorScheme}
    >
      {colorScheme === "light" ? <MoonStars /> : <Sun />}
    </ActionIcon>
  );
};
