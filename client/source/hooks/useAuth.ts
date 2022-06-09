import { useCreateUserMutation, useCurrentUserQuery, useLoginWithPasswordMutation, useLogoutMutation, useResetPasswordMutation, useSendResetPasswordEmailMutation } from "../generated/graphql";

export const useAuth = () => {
  const [{ data }] = useCurrentUserQuery();
  const [, loginWithPassword] = useLoginWithPasswordMutation();
  const [, createUser] = useCreateUserMutation();
  const [, logout] = useLogoutMutation();
  const [, sendResertPasswordEmail] = useSendResetPasswordEmailMutation();
  const [, resetPassword] = useResetPasswordMutation();

  // Return the user object and auth methods
  return {
    user: data?.currentUser,
    loginWithPassword: (email: string, password: string) => loginWithPassword({ email, password }).then(response => response?.data?.loginWithPassword),
    createUser: (username: string, email: string, password: string) => createUser({ username, email, password }).then(response => response?.data?.createUser),
    logout,
    sendResertPasswordEmail,
    resetPassword: (token: string, newPassword: string) => resetPassword({ token, newPassword }).then(response => response?.data?.resetPassword),
  }
}
