import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import ReactDOM from "react-dom/client";
import { Provider as UrqlProvider } from "urql";
import App from "./App";
import theme from "./theme";
import { createUrqlClient } from "./createUrqlClient";
import "@fontsource/lobster";

const client = createUrqlClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <UrqlProvider value={client}>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </UrqlProvider>
);
