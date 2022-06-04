import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createClient, Provider as UrqlProvider } from "urql";
import App from "./App";
import theme from "./theme";

const client = createClient({
  url: "http://localhost:4000/graphql", // TODO: Move to .env or something
  fetchOptions: {
    credentials: "include",
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UrqlProvider value={client}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </UrqlProvider>
  </StrictMode>
);
