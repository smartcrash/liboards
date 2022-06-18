
import { gql } from '@urql/core';
import {
  Cache,
  cacheExchange,
  DataFields,
  QueryInput
} from "@urql/exchange-graphcache";
import {
  createClient,
  dedupExchange,
  errorExchange,
  fetchExchange
} from "urql";
import {
  AddCommentMutation,
  AddCommentMutationVariables,
  AddTaskMutation,
  AddTaskMutationVariables,
  AddToFavoritesMutationVariables,
  AllBoardsDocument,
  AllBoardsQuery,
  AllDeletedBoardsDocument,
  AllDeletedBoardsQuery,
  AllFavoritesDocument,
  AllFavoritesQuery,
  BoardFragmentFragmentDoc,
  CreateBoardMutation,
  CreateUserMutation,
  CurrentUserDocument,
  CurrentUserQuery,
  DeleteBoardMutation,
  DeleteBoardMutationVariables, FindCardByIdDocument, FindCardByIdQuery, LoginWithPasswordMutation,
  LogoutMutation, RemoveCardMutationVariables, RemoveColumnMutation, RemoveFromFavoritesMutationVariables, RemoveTaskMutation, RemoveTaskMutationVariables, RestoreBoardMutation,
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

          addToFavorites: (_, { id }: AddToFavoritesMutationVariables, cache) => {
            // Update `favorite` field on every Board on cache
            const fragment = gql`
              fragment _ on Board {
                id
                favorite
              }
            `
            cache.writeFragment(fragment, { id, favorite: true });

            // Add Board to `allFavoritesQuery` cache
            cache.updateQuery({ query: AllFavoritesDocument }, (data: AllFavoritesQuery | null) => {
              if (!data || !data.favorites) return data

              const entity = cache.readFragment(BoardFragmentFragmentDoc, { id })

              if (!entity) return data

              data.favorites.push({
                __typename: 'Board' as const,
                ...(entity as any)
              })

              return data
            })
          },

          removeFromFavorites: (result, args: RemoveFromFavoritesMutationVariables, cache, info) => {
            const fragment = gql`
              fragment _ on Board {
                id
                favorite
              }
            `;

            cache.writeFragment(fragment, { id: args.id, favorite: false });

            cache.updateQuery({ query: AllFavoritesDocument }, (data: AllFavoritesQuery | null) => {
              if (!data || !data.favorites) return data
              data.favorites = data.favorites.filter(({ id }) => id !== args.id)
              return data
            })
          },

          addTask(result: AddTaskMutation, args: AddTaskMutationVariables, cache, info) {
            cache.updateQuery(
              {
                query: FindCardByIdDocument,
                variables: { id: args.cardId }
              },
              (data: FindCardByIdQuery | null) => {
                if (!result.task) return data
                if (!data || !data.card) return data

                data.card.tasks.push(result.task)

                return data
              }
            )
          },

          removeTask(result: RemoveTaskMutation, args: RemoveTaskMutationVariables, cache, info) {
            cache.invalidate({
              __typename: 'Task',
              id: args.id,
            });
          },

          addComment(result: AddCommentMutation, args: AddCommentMutationVariables, cache, info) {
            cache.updateQuery(
              {
                query: FindCardByIdDocument,
                variables: { id: args.cardId }
              },
              (data: FindCardByIdQuery | null) => {
                if (!result.comment) return data
                if (!data || !data.card) return data

                data.card.comments.push(result.comment)

                return data
              }
            )
          },

          removeComment(result: RemoveColumnMutation, args: RemoveCardMutationVariables, cache, info) {
            cache.invalidate({
              __typename: 'Comment',
              id: args.id,
            });
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
