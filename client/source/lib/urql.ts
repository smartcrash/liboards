import { gql } from '@urql/core';
import { cacheExchange } from "@urql/exchange-graphcache";
import {
  createClient,
  dedupExchange,
  errorExchange,
  fetchExchange
} from "urql";
import { API_URL } from '../constants';
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
  Board,
  BoardFragmentFragmentDoc, CreateBoardMutation,
  CreateUserMutation,
  CurrentUserDocument,
  CurrentUserQuery,
  DeleteBoardMutation,
  DeleteBoardMutationVariables, FindCardByIdDocument,
  FindCardByIdQuery,
  ForceDeleteBoardMutation,
  ForceDeleteBoardMutationVariables,
  LoginWithPasswordMutation,
  LogoutMutation,
  RemoveCardMutationVariables,
  RemoveColumnMutation,
  RemoveFromFavoritesMutationVariables,
  RemoveTaskMutation,
  RemoveTaskMutationVariables,
  RestoreBoardMutation,
  RestoreBoardMutationVariables
} from "../generated/graphql";

export const createUrqlClient = () => createClient({
  url: API_URL,
  fetchOptions: { credentials: "include" },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          loginWithPassword(result: LoginWithPasswordMutation, args, cache, info) {
            cache.updateQuery({ query: CurrentUserDocument }, (data: CurrentUserQuery | null) => {
              if (result.loginWithPassword.errors) return data;
              else return { currentUser: result.loginWithPassword.user };
            })
          },

          createUser(result: CreateUserMutation, args, cache, info) {
            cache.updateQuery({ query: CurrentUserDocument }, (data: CurrentUserQuery | null) => {
              if (result.createUser.errors) return data;
              else return { currentUser: result.createUser.user };
            })
          },

          logout(result: LogoutMutation, args, cache, info) {
            cache.updateQuery({ query: CurrentUserDocument }, () => ({ currentUser: null }))
          },

          createBoard(result: CreateBoardMutation, args, cache, info) {
            cache.updateQuery({ query: AllBoardsDocument }, (data: AllBoardsQuery | null) => {
              if (!data?.boards) return data

              // NOTE: This works under the assumpsion that the `allBoards` query
              // returns boards ordered by `createdAt`, this may change in the
              // future.
              data.boards.unshift(result.board)

              return data
            })
          },

          deleteBoard(result: DeleteBoardMutation, args: DeleteBoardMutationVariables, cache) {
            // Remove deleted board from cache
            cache.invalidate('Query', 'findBoardById', { id: args.id })

            // Remove board from allBoardsQuery
            cache.updateQuery(
              { query: AllBoardsDocument },
              (data: AllBoardsQuery | null) => ({ boards: (data?.boards || []).filter((board) => board.id !== args.id) })
            )

            // Remove board from allFavorites
            cache.updateQuery(
              { query: AllFavoritesDocument },
              (data: AllFavoritesQuery | null) => ({ favorites: (data?.favorites || []).filter((board) => board.id !== args.id) })
            )
            // Append board to allDeletedBoards query if is in cache
            const board = cache.readFragment(BoardFragmentFragmentDoc, { id: args.id }) as Board | null

            if (board) {
              cache.updateQuery({ query: AllDeletedBoardsDocument }, (data: AllDeletedBoardsQuery | null) => {
                if (!data) return data
                data.boards.unshift({ __typename: 'Board', ...board })
                return data
              })
            } else {
              // If is not in cache, just invalidate the whole list
              // so is re-fetch again and update the UI
              cache.invalidate('Query', 'allDeletedBoards')
            }
          },

          restoreBoard(result: RestoreBoardMutation, args: RestoreBoardMutationVariables, cache, info) {
            cache.invalidate('Query', 'allBoards')

            cache.updateQuery({ query: AllDeletedBoardsDocument }, (data: AllDeletedBoardsQuery | null) => {
              if (!data?.boards) return data

              data.boards = data.boards.filter((board) => board.id !== args.id)

              return data
            })
          },

          forceDeleteBoard(result: ForceDeleteBoardMutation, args: ForceDeleteBoardMutationVariables, cache, info) {
            cache.invalidate({ __typename: 'Board', id: args.id })
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

              const board = cache.readFragment(BoardFragmentFragmentDoc, { id })

              if (!board) return data

              data.favorites.push({
                __typename: 'Board' as const,
                ...(board as any)
              })

              return data
            })
          },

          removeFromFavorites(result, args: RemoveFromFavoritesMutationVariables, cache, info) {
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
