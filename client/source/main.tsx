import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { Provider as UrqlProvider } from "urql";
import App from "./App";
import theme from "./theme";
import { createUrqlClient } from "./urql";

const client = createUrqlClient();

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
