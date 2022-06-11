import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type AuthenticationResponse = {
  __typename?: 'AuthenticationResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type Board = {
  __typename?: 'Board';
  createdAt: Scalars['DateTime'];
  description: Scalars['String'];
  id: Scalars['Float'];
  title: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  user: User;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createBoard: Board;
  createUser: AuthenticationResponse;
  loginWithPassword: AuthenticationResponse;
  logout: Scalars['Boolean'];
  resetPassword: AuthenticationResponse;
  sendResetPasswordEmail: Scalars['Boolean'];
  updateBoard?: Maybe<Board>;
};


export type MutationCreateBoardArgs = {
  description?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
};


export type MutationCreateUserArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationLoginWithPasswordArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationSendResetPasswordEmailArgs = {
  email: Scalars['String'];
};


export type MutationUpdateBoardArgs = {
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  title?: InputMaybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  allBoards: Array<Board>;
  currentUser?: Maybe<User>;
  findBoardById?: Maybe<Board>;
};


export type QueryFindBoardByIdArgs = {
  id: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  boards: Array<Board>;
  createdAt: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['Float'];
  updatedAt: Scalars['String'];
  username: Scalars['String'];
};

export type UserFragmentFragment = { __typename?: 'User', id: number, username: string, email: string, createdAt: string, updatedAt: string };

export type CreateBoardMutationVariables = Exact<{
  title: Scalars['String'];
  description?: InputMaybe<Scalars['String']>;
}>;


export type CreateBoardMutation = { __typename?: 'Mutation', board: { __typename?: 'Board', id: number, title: string, description: string } };

export type CreateUserMutationVariables = Exact<{
  password: Scalars['String'];
  email: Scalars['String'];
  username: Scalars['String'];
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'AuthenticationResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, email: string, createdAt: string, updatedAt: string } | null } };

export type LoginWithPasswordMutationVariables = Exact<{
  password: Scalars['String'];
  email: Scalars['String'];
}>;


export type LoginWithPasswordMutation = { __typename?: 'Mutation', loginWithPassword: { __typename?: 'AuthenticationResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, email: string, createdAt: string, updatedAt: string } | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type ResetPasswordMutationVariables = Exact<{
  newPassword: Scalars['String'];
  token: Scalars['String'];
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: { __typename?: 'AuthenticationResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, email: string, createdAt: string, updatedAt: string } | null } };

export type SendResetPasswordEmailMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type SendResetPasswordEmailMutation = { __typename?: 'Mutation', sendResetPasswordEmail: boolean };

export type UpdateBoardMutationVariables = Exact<{
  id: Scalars['Int'];
  title?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
}>;


export type UpdateBoardMutation = { __typename?: 'Mutation', board?: { __typename?: 'Board', id: number } | null };

export type AllBoardsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllBoardsQuery = { __typename?: 'Query', boards: Array<{ __typename?: 'Board', id: number, title: string, description: string, createdAt: any, updatedAt: any }> };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: number, username: string, email: string, createdAt: string, updatedAt: string } | null };

export type FindBoardByIdQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type FindBoardByIdQuery = { __typename?: 'Query', board?: { __typename?: 'Board', id: number, title: string, description: string, createdAt: any, updatedAt: any, user: { __typename?: 'User', id: number, username: string } } | null };

export const UserFragmentFragmentDoc = gql`
    fragment UserFragment on User {
  id
  username
  email
  createdAt
  updatedAt
}
    `;
export const CreateBoardDocument = gql`
    mutation CreateBoard($title: String!, $description: String) {
  board: createBoard(title: $title, description: $description) {
    id
    title
    description
  }
}
    `;

export function useCreateBoardMutation() {
  return Urql.useMutation<CreateBoardMutation, CreateBoardMutationVariables>(CreateBoardDocument);
};
export const CreateUserDocument = gql`
    mutation CreateUser($password: String!, $email: String!, $username: String!) {
  createUser(password: $password, email: $email, username: $username) {
    errors {
      field
      message
    }
    user {
      ...UserFragment
    }
  }
}
    ${UserFragmentFragmentDoc}`;

export function useCreateUserMutation() {
  return Urql.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument);
};
export const LoginWithPasswordDocument = gql`
    mutation LoginWithPassword($password: String!, $email: String!) {
  loginWithPassword(password: $password, email: $email) {
    errors {
      field
      message
    }
    user {
      ...UserFragment
    }
  }
}
    ${UserFragmentFragmentDoc}`;

export function useLoginWithPasswordMutation() {
  return Urql.useMutation<LoginWithPasswordMutation, LoginWithPasswordMutationVariables>(LoginWithPasswordDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const ResetPasswordDocument = gql`
    mutation ResetPassword($newPassword: String!, $token: String!) {
  resetPassword(newPassword: $newPassword, token: $token) {
    errors {
      field
      message
    }
    user {
      ...UserFragment
    }
  }
}
    ${UserFragmentFragmentDoc}`;

export function useResetPasswordMutation() {
  return Urql.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument);
};
export const SendResetPasswordEmailDocument = gql`
    mutation SendResetPasswordEmail($email: String!) {
  sendResetPasswordEmail(email: $email)
}
    `;

export function useSendResetPasswordEmailMutation() {
  return Urql.useMutation<SendResetPasswordEmailMutation, SendResetPasswordEmailMutationVariables>(SendResetPasswordEmailDocument);
};
export const UpdateBoardDocument = gql`
    mutation UpdateBoard($id: Int!, $title: String, $description: String) {
  board: updateBoard(id: $id, title: $title, description: $description) {
    id
  }
}
    `;

export function useUpdateBoardMutation() {
  return Urql.useMutation<UpdateBoardMutation, UpdateBoardMutationVariables>(UpdateBoardDocument);
};
export const AllBoardsDocument = gql`
    query AllBoards {
  boards: allBoards {
    id
    title
    description
    createdAt
    updatedAt
  }
}
    `;

export function useAllBoardsQuery(options?: Omit<Urql.UseQueryArgs<AllBoardsQueryVariables>, 'query'>) {
  return Urql.useQuery<AllBoardsQuery>({ query: AllBoardsDocument, ...options });
};
export const CurrentUserDocument = gql`
    query CurrentUser {
  currentUser {
    ...UserFragment
  }
}
    ${UserFragmentFragmentDoc}`;

export function useCurrentUserQuery(options?: Omit<Urql.UseQueryArgs<CurrentUserQueryVariables>, 'query'>) {
  return Urql.useQuery<CurrentUserQuery>({ query: CurrentUserDocument, ...options });
};
export const FindBoardByIdDocument = gql`
    query FindBoardById($id: Int!) {
  board: findBoardById(id: $id) {
    id
    title
    description
    user {
      id
      username
    }
    createdAt
    updatedAt
  }
}
    `;

export function useFindBoardByIdQuery(options: Omit<Urql.UseQueryArgs<FindBoardByIdQueryVariables>, 'query'>) {
  return Urql.useQuery<FindBoardByIdQuery>({ query: FindBoardByIdDocument, ...options });
};