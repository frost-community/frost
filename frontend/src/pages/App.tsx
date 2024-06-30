import { Button, Image, useMantineColorScheme } from "@mantine/core";

import deleteParrot from "/deletedparrot.gif";

import { useToggle } from "@mantine/hooks";

export const App = () => {
  const [deleted, toggleDeleted] = useToggle();
  const { toggleColorScheme } = useMantineColorScheme();

  return (
    <>
      <Image
        src={deleteParrot}
        h={100}
        w="auto"
        style={{
          visibility: deleted ? "hidden" : "visible",
        }}
      />
      <Button
        color="red"
        onClick={() => {
          toggleDeleted();
        }}
      >
        DeleteParrotをDelete
      </Button>
      <Button onClick={toggleColorScheme}>Change DarkMode</Button>
    </>
  );
};
