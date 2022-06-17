import { afterEach } from "vitest";
import React, { FC, ReactElement } from "react";
import { render, RenderOptions, cleanup } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";

afterEach(() => {
  cleanup();
});

const AllTheProviders: FC<{ children: React.ReactNode }> = ({ children }) => (
  <ChakraProvider>{children}</ChakraProvider>
);

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
export { customRender as render };
