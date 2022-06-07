import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider as UrqlProvider } from "urql";
import App from "./App";
import { ForgotPassword, Login, ResetPassword, SignUp } from "./pages";
import theme from "./theme";
import { createUrqlClient } from "./urql";

const client = createUrqlClient();

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
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
            </Route>
          </Routes>
        </Router>
      </ChakraProvider>
    </UrqlProvider>
  </StrictMode>
);
