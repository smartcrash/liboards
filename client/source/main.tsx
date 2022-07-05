import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import "@fontsource/lobster";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ReactDOM from "react-dom/client";
import { Helmet } from "react-helmet";
import { Provider as UrqlProvider } from "urql";
import App from "./App";
import { APP_NAME, GOOGLE_CLIENT_ID } from "./constants";
import { createUrqlClient } from "./lib/urql";
import theme from "./theme";

const client = createUrqlClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <Helmet defaultTitle={APP_NAME} titleTemplate={`%s | ${APP_NAME}`} />
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <UrqlProvider value={client}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </UrqlProvider>
    </GoogleOAuthProvider>
  </>
);
