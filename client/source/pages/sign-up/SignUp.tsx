import { ArrowBackIcon } from "@chakra-ui/icons";
import { Text, Button, Heading, Stack, VStack } from "@chakra-ui/react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { Container, Input, PasswordInput, Link } from "../../components";
import { APP_NAME } from "../../constants";
import { useAuth } from "../../hooks/useAuth";
import { route } from "../../routes";

interface FieldValues {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export const SignUp = () => {
  const { createUser } = useAuth();
  const {
    handleSubmit,
    setError,
    control,
    formState: { isSubmitting },
  } = useForm<FieldValues>({});
  const onSubmit = handleSubmit(async ({ username, email, password, passwordConfirm }) => {
    if (password !== passwordConfirm) {
      setError("passwordConfirm", { message: "Passwords must match." });
      return;
    }

    const response = await createUser(username, email, password);

    if (response?.errors?.length) {
      const { errors } = response;
      errors.forEach(({ field, message }: any) => setError(field, { message }));
    }
  });

  return (
    <>
      <Helmet title={"Sign up"} />

      <Container pt={{ base: 16, sm: 24 }} pb={10} px={6} maxW={"lg"}>
        <VStack alignItems={"stretch"} flexGrow={1} spacing={{ base: 12, md: 14 }}>
          <Text>
            Already a member?{" "}
            <Link to={route("login")} color={"blue"}>
              Sign in
            </Link>
          </Text>

          <Heading fontSize={"3xl"}>Sign up to {APP_NAME}</Heading>

          <Stack as={"form"} onSubmit={onSubmit} justifyContent={"center"} alignItems={"stretch"} spacing={10}>
            <VStack alignItems={"stretch"} spacing={6}>
              <Input
                label={"Username"}
                name={"username"}
                autoComplete={"username"}
                autoFocus
                placeholder={"jhon doe"}
                control={control}
                variant={"filled"}
                rules={{ required: true }}
                data-testid={"username"}
              />

              <Input
                label={"Email"}
                name={"email"}
                type={"email"}
                placeholder={"jhondoe@example.com"}
                autoComplete={"email"}
                control={control}
                variant={"filled"}
                rules={{ required: true }}
                data-testid={"email"}
              />

              <PasswordInput
                label={"Password"}
                name={"password"}
                placeholder={"At least +4 chars"}
                autoComplete={"new-password"}
                control={control}
                variant={"filled"}
                rules={{ required: true }}
                data-testid={"password"}
              />

              <PasswordInput
                label={"Confirm password"}
                name={"passwordConfirm"}
                placeholder={"••••••"}
                autoComplete={"off"}
                control={control}
                variant={"filled"}
                rules={{ required: true }}
                data-testid={"passwordConfirm"}
              />
            </VStack>

            <Button isLoading={isSubmitting} type={"submit"} data-testid={"submit"}>
              Create account
            </Button>
          </Stack>
        </VStack>
      </Container>
    </>
  );
};
