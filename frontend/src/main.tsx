import { MantineProvider } from "@mantine/core";
import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./pages/App.tsx";
import "@mantine/core/styles.css";
import { themeConfig } from "./style/themeConfig.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider theme={themeConfig} defaultColorScheme="auto">
      <App />
    </MantineProvider>
  </React.StrictMode>,
);
