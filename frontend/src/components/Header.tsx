import { Group } from "@mantine/core";

import { ColorSchemeToggleButton } from "@/components/ColorSchemeToggleButton";

export const Header = () => {
  return (
    <Group p="12" justify="flex-end" bg="teal.9">
      <ColorSchemeToggleButton />
    </Group>
  );
};
