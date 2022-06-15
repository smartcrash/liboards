
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
  AddCardMutationVariables,
  AddColumnMutation,
  AddColumnMutationVariables,
  AllBoardsDocument,
  AllBoardsQuery,
  AllDeletedBoardsDocument,
  AllDeletedBoardsQuery,
  CreateBoardMutation,
  CreateUserMutation,
  CurrentUserDocument,
  CurrentUserQuery,
  DeleteBoardMutation,
  DeleteBoardMutationVariables,
  FindBoardByIdDocument,
  FindBoardByIdQuery,
  LoginWithPasswordMutation,
  LogoutMutation,
  MoveCardMutationVariables,
  RestoreBoardMutation,
  RestoreBoardMutationVariables
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
      optimistic: {
        moveCard: (variables: MoveCardMutationVariables, cache, info) => ({
          __typename: 'Card',
          id: variables.id,
          index: variables.toIndex,
          columnId: variables.toColumnId
        }),
      },

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

          deleteBoard: (result, args: DeleteBoardMutationVariables, cache, info) => {
            cache.invalidate('Query', 'findBoardById', { id: args.id })
            // TODO: Update query instead of invalidate is board is on cache
            cache.invalidate('Query', 'allDeletedBoards')

            updateQuery<DeleteBoardMutation, AllBoardsQuery>(
              cache,
              { query: AllBoardsDocument },
              result, (result, data) => ({ boards: (data?.boards || []).filter((board) => board.id !== args.id) })
            )
          },

          restoreBoard: (result, args: RestoreBoardMutationVariables, cache, info) => {
            cache.invalidate('Query', 'allBoards')

            updateQuery<RestoreBoardMutation, AllDeletedBoardsQuery>(
              cache,
              { query: AllDeletedBoardsDocument },
              result, (result, data) => ({ boards: (data?.boards || []).filter((board) => board.id !== args.id) })
            )
          },

          addColumn: (result, args: AddColumnMutationVariables, cache, info) => {
            updateQuery<AddColumnMutation, FindBoardByIdQuery>(
              cache,
              { query: FindBoardByIdDocument, variables: { id: args.boardId } },
              result, (result, data) => {
                // If there is no cache or the mutaton didn't resolve correctly
                // just leave the query cache as it is.
                if (!data?.board || !result.column) return data

                // TODO: Use merge function
                return {
                  ...data,
                  board: {
                    ...data.board,
                    columns: [...data.board.columns, result.column]
                  }
                }
              }
            )
          },

          addCard: (result, args: AddCardMutationVariables, cache, info) => {
            // TODO: Optimize be directly adding card to column
            // NOTE: This works for updating the UI when a card is added
            //       but it forces a re-fetch. A better way would be to add
            //       the card to the Board's `columns[].cards` array.
            //       But from here we don't have to Board's ID.
            cache.invalidate({
              __typename: 'Column',
              id: args.columnId,
            });
          },

          // moveCard: (result, args: MoveCardMutationVariables, cache, info) => {
          //   cache.invalidate({
          //     __typename: 'Column',
          //     id: args.toColumnId
          //   });
          // },
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
