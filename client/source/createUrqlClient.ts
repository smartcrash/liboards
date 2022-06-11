
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
  AllBoardsDocument,
  AllBoardsQuery,
  CreateBoardMutation,
  CreateUserMutation,
  CurrentUserDocument,
  CurrentUserQuery,
  DeleteBoardMutation, DeleteBoardMutationVariables, LoginWithPasswordMutation,
  LogoutMutation
} from "./generated/graphql";

function updateQuery<R extends DataFields, Q>(
  cache: Cache,
  queryInput: QueryInput,
  result: any,
  // The `data` may be null if the cache doesn't actually have
  // enough locally cached information to fulfil the query
  fn: (result: R, data: Q | null) => Q | null
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
              (result, data) => {
                if (result.loginWithPassword.errors) return data;
                else return { currentUser: result.loginWithPassword.user };
              }
            );
          },

          createUser: (result, args, cache, info) => {
            updateQuery<CreateUserMutation, CurrentUserQuery>(
              cache,
              { query: CurrentUserDocument },
              result,
              (result, data) => {
                if (result.createUser.errors) return data;
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

          createBoard: (result, args, cache, info) => {
            updateQuery<CreateBoardMutation, AllBoardsQuery>(
              cache,
              { query: AllBoardsDocument },
              // NOTE: This works under the assumpsion that the `allBoards` query
              // returns boards ordered by `createdAt`, this may change in the
              // future.
              result, (result, data) => ({ boards: [result.board, ...(data?.boards || [])] })
            )
          },

          deleteBoard: (result, args, cache, info) => {
            cache.invalidate({
              __typename: 'Board',
              id: (args as DeleteBoardMutationVariables).id,
            });

            updateQuery<DeleteBoardMutation, AllBoardsQuery>(
              cache,
              { query: AllBoardsDocument },
              result, (result, data) => ({ boards: (data?.boards || []).filter((board) => board.id !== args.id) })
            )
          }
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
