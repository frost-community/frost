import { Button, type MantineThemeOverride } from "@mantine/core";

export const themeConfig: MantineThemeOverride = {
  components: {
    Button: Button.extend({
      defaultProps: {
        color: "cyan",
      },
    }),
  },
};
