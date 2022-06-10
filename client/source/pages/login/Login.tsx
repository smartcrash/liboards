import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Input, Link, PasswordInput } from "../../components";
import { useAuth } from "../../hooks/useAuth";
import { route } from "../../routes";

interface FieldValues {
  email: string;
  password: string;
}

export const Login = () => {
  const { loginWithPassword } = useAuth();
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
    <Container
      maxW={"lg"}
      py={{ base: "12", md: "24" }}
      px={{ base: "0", sm: "8" }}
    >
      <Stack spacing={"8"}>
        <Stack spacing={"6"}>
          <Stack spacing={{ base: "2", md: "3" }} textAlign={"center"}>
            <Heading size={"lg"}>Log in to your account</Heading>
            <HStack spacing={2} justify={"center"}>
              <Text color={"muted"}>Don't have an account?</Text>
              <Link to={route("signUp")} data-testid={"go-to-signup"}>
                Sign up
              </Link>
            </HStack>
          </Stack>
        </Stack>
        <Box
          as={"form"}
          onSubmit={onSubmit}
          py={{ base: "0", sm: "8" }}
          px={{ base: "4", sm: "10" }}
        >
          <Stack spacing={6}>
            <Stack spacing={5}>
              <Input
                type={"email"}
                autoComplete={"email"}
                label={"Email"}
                name={"email"}
                control={control}
                rules={{ required: true }}
                data-testid={"email"}
              />

              <PasswordInput
                label={"Password"}
                autoComplete={"current-password"}
                name={"password"}
                control={control}
                rules={{ required: true }}
                data-testid={"password"}
              />
            </Stack>

            <HStack justifyContent={"flex-end"}>
              <Link
                to={route("forgotPwd")}
                size={"sm"}
                data-testid={"forgot-password"}
              >
                Forgot password?
              </Link>
            </HStack>

            <Button
              isLoading={isSubmitting}
              type={"submit"}
              data-testid={"submit"}
            >
              Sign in
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};
