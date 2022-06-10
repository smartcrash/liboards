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
  username: string;
  email: string;
  password: string;
}

export const SignUp = () => {
  const { createUser } = useAuth();
  const {
    handleSubmit,
    setError,
    control,
    formState: { isSubmitting },
  } = useForm<FieldValues>({});
  const onSubmit = handleSubmit(async ({ username, email, password }) => {
    const response = await createUser(username, email, password);

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
            <Heading size={"lg"}>Create a new account</Heading>
            <HStack spacing={2} justify={"center"}>
              <Text color={"muted"}>Already have an account?</Text>
              <Link to={route("login")}>Login</Link>
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
                label={"Name"}
                name={"username"}
                autoComplete={"username"}
                control={control}
                rules={{ required: true }}
                data-testid={"username"}
              />

              <Input
                label={"Email"}
                name={"email"}
                type={"email"}
                autoComplete={"email"}
                control={control}
                rules={{ required: true }}
                data-testid={"email"}
              />

              <PasswordInput
                label={"Password"}
                name={"password"}
                autoComplete={"new-password"}
                control={control}
                rules={{ required: true }}
                data-testid={"password"}
              />
            </Stack>

            <Button
              isLoading={isSubmitting}
              type={"submit"}
              data-testid={"submit"}
            >
              Sign up
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};
