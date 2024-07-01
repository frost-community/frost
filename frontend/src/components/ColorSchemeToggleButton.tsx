import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { MoonStars, Sun } from "@phosphor-icons/react";

export const ColorSchemeToggleButton = () => {
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
