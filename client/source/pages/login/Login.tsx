import { Button, ButtonGroup, Heading, Stack, Text } from "@chakra-ui/react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { Container, Input, Link, PasswordInput } from "../../components";
import { APP_NAME } from "../../constants";
import { useAuth } from "../../hooks/useAuth";
import { route } from "../../routes";
import { DividerWithText } from "./DividerWithText";
import { GoogleLoginButton } from "./GoogleLoginButton";

interface FieldValues {
  email: string;
  password: string;
}

export const Login = () => {
  const { loginWithPassword, loginWithGoogle } = useAuth();
  const {
    handleSubmit,
    setError,
    control,
    formState: { isSubmitting },
  } = useForm<FieldValues>({});
  const onSubmit = handleSubmit(async ({ email, password }) => {
    const response = await loginWithPassword(email, password);

    if (response?.errors?.length) {
      const { errors } = response;
      errors.forEach(({ field, message }: any) => setError(field, { message }));
    }
  });

  return (
    <>
      <Helmet title={"Sign in"} />

      <Container pt={{ base: 16, sm: 24 }} pb={10} px={6} maxW={"md"}>
        <Heading fontSize={"3xl"} mb={9}>
          Sign in to {APP_NAME}
        </Heading>

        <ButtonGroup flexDir={"column"} spacing={0} w={"full"} rowGap={4}>
          <GoogleLoginButton onSuccess={({ tokenId }) => loginWithGoogle(tokenId)} />
        </ButtonGroup>

        <DividerWithText my={8}>Or</DividerWithText>

        <Stack as={"form"} onSubmit={onSubmit} spacing={5}>
          <Stack spacing={4}>
            <Input
              autoComplete={"email"}
              label={"Username or Email Address"}
              name={"email"}
              variant={"filled"}
              autoFocus
              control={control}
              rules={{ required: true }}
              data-testid={"email"}
            />

            <Stack spacing={2} alignItems={"flex-end"}>
              <PasswordInput
                label={"Password"}
                autoComplete={"current-password"}
                name={"password"}
                variant={"filled"}
                control={control}
                rules={{ required: true }}
                data-testid={"password"}
              />

              <Link to={route("forgotPwd")} color={"blue"} data-testid={"forgot-password"} tabIndex={-1}>
                Forgot password?
              </Link>
            </Stack>
          </Stack>

          <Button isLoading={isSubmitting} type={"submit"} data-testid={"submit"}>
            Sign in
          </Button>

          <Text textAlign={"center"} pt={4}>
            Not a member?{" "}
            <Link to={route("signUp")} color={"blue"} data-testid={"go-to-signup"}>
              Sign up now
            </Link>
          </Text>
        </Stack>
      </Container>
    </>
  );
};
