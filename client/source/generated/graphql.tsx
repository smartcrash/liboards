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

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createUser: AuthenticationResponse;
  loginWithPassword: AuthenticationResponse;
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

export type Query = {
  __typename?: 'Query';
  currentUser?: Maybe<User>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  id: Scalars['Float'];
  updatedAt: Scalars['DateTime'];
  username: Scalars['String'];
};

export type CreateUserMutationVariables = Exact<{
  password: Scalars['String'];
  email: Scalars['String'];
  username: Scalars['String'];
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'AuthenticationResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, email: string, createdAt: any, updatedAt: any } | null } };

export type LoginWithPasswordMutationVariables = Exact<{
  password: Scalars['String'];
  email: Scalars['String'];
}>;


export type LoginWithPasswordMutation = { __typename?: 'Mutation', loginWithPassword: { __typename?: 'AuthenticationResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, email: string, createdAt: any, updatedAt: any } | null } };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: number, username: string, email: string, createdAt: any, updatedAt: any } | null };


export const CreateUserDocument = gql`
    mutation CreateUser($password: String!, $email: String!, $username: String!) {
  createUser(password: $password, email: $email, username: $username) {
    errors {
      field
      message
    }
    user {
      id
      username
      email
      createdAt
      updatedAt
    }
  }
}
    `;

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
      id
      username
      email
      createdAt
      updatedAt
    }
  }
}
    `;

export function useLoginWithPasswordMutation() {
  return Urql.useMutation<LoginWithPasswordMutation, LoginWithPasswordMutationVariables>(LoginWithPasswordDocument);
};
export const CurrentUserDocument = gql`
    query CurrentUser {
  currentUser {
    id
    username
    email
    createdAt
    updatedAt
  }
}
    `;

export function useCurrentUserQuery(options?: Omit<Urql.UseQueryArgs<CurrentUserQueryVariables>, 'query'>) {
  return Urql.useQuery<CurrentUserQuery>({ query: CurrentUserDocument, ...options });
};