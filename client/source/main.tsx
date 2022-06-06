import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import {
  Cache,
  cacheExchange,
  DataFields,
  QueryInput,
} from "@urql/exchange-graphcache";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  createClient,
  dedupExchange,
  fetchExchange,
  Provider as UrqlProvider,
} from "urql";
import App from "./App";
import {
  CreateUserMutation,
  CurrentUserDocument,
  CurrentUserQuery,
  LoginWithPasswordMutation,
  Query,
} from "./generated/graphql";
import { Login, SignUp } from "./pages";
import theme from "./theme";

function updateQuery<R extends DataFields, Q extends Query>(
  cache: Cache,
  queryInput: QueryInput,
  result: any,
  fn: (result: R, query: Q) => Q
) {
  return cache.updateQuery(
    queryInput,
    (data) => fn(result, data as any) as any
  );
}

const client = createClient({
  url: "http://localhost:4000/graphql", // TODO: Move to .env or something
  fetchOptions: { credentials: "include" },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          loginWithPassword: (result, args, cache, info) => {
            updateQuery<LoginWithPasswordMutation, CurrentUserQuery>(
              cache,
              { query: CurrentUserDocument },
              result,
              (result, query) => {
                if (result.loginWithPassword.errors) return query;
                else return { currentUser: result.loginWithPassword.user };
              }
            );
          },

          createUser: (result, args, cache, info) => {
            updateQuery<CreateUserMutation, CurrentUserQuery>(
              cache,
              { query: CurrentUserDocument },
              result,
              (result, query) => {
                if (result.createUser.errors) return query;
                else return { currentUser: result.createUser.user };
              }
            );
          },
        },
      },
    }),
    fetchExchange,
  ],
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
