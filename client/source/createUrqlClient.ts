
import {
  Cache,
  cacheExchange,
  DataFields,
  QueryInput
} from "@urql/exchange-graphcache";
import {
  createClient,
  dedupExchange, errorExchange, fetchExchange
} from "urql";
import {
  CreateUserMutation,
  CurrentUserDocument,
  CurrentUserQuery,
  LoginWithPasswordMutation,
  LogoutMutation
} from "./generated/graphql";

function updateQuery<R extends DataFields, Q>(
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

export const createUrqlClient = () => createClient({
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

          logout: (result, args, cache, info) => {
            updateQuery<LogoutMutation, CurrentUserQuery>(
              cache,
              { query: CurrentUserDocument },
              result,
              () => ({ currentUser: null })
            );
          },

          createBoard: (result, args, cache, info) => cache.invalidate('Query', 'allBoards'),
        },
      },
    }),
    errorExchange({
      onError: (error) => {
        const isAuthError = error.message.includes('not authenticated')

        if (isAuthError) window.location.replace('/login')
      }
    }),
    fetchExchange,
  ],
})
