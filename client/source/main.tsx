import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createClient, Provider as UrqlProvider } from "urql";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import theme from "./theme";
import { Login, SignUp } from "./pages";

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
        <Router>
          <Routes>
            <Route path="/" element={<App />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
            </Route>
          </Routes>
        </Router>
      </ChakraProvider>
    </UrqlProvider>
  </StrictMode>
);
