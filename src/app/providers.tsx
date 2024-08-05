"use client";

import { store } from "@/store/store";
import theme from "@/theme";
import { ThemeProvider } from "@emotion/react";
import { Provider } from "react-redux";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>{children}</Provider>
    </ThemeProvider>
  );
}
