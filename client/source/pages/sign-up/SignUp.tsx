import { Box, Button, Stack, VStack, Heading, Text } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Container, Input, Link, PasswordInput } from "../../components";
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
  const onSubmit = handleSubmit(
    async ({ username, email, password, passwordConfirm }) => {
      if (password !== passwordConfirm) {
        setError("passwordConfirm", { message: "Passwords must match." });
        return;
      }

      const response = await createUser(username, email, password);

      if (response?.errors?.length) {
        const { errors } = response;
        errors.forEach(({ field, message }: any) =>
          setError(field, { message })
        );
      }
    }
  );

  return (
    <Container pt={{ base: 16, sm: 24 }} pb={10} px={6}>
      <VStack
        alignItems={"stretch"}
        flexGrow={1}
        spacing={{ base: 12, sm: 20 }}
      >
        <VStack alignItems={{ base: "flex-start", sm: "center" }}>
          <Heading fontSize={{ base: "5xl", sm: "5xl" }}>
            Create new account
          </Heading>
          <Text>
            Already have an account?{" "}
            <Link color={"primary.500"} to={route("login")}>
              Log in
            </Link>
          </Text>
        </VStack>

        <Stack spacing={8}>
          <Stack
            as={"form"}
            onSubmit={onSubmit}
            justifyContent={"center"}
            alignItems={"center"}
            spacing={8}
          >
            <VStack alignItems={"stretch"} spacing={6} w={"full"} maxW={"3xl"}>
              <Stack direction={{ base: "column", sm: "row" }} spacing={6}>
                <Box flexGrow={1}>
                  <Input
                    label={"Username"}
                    name={"username"}
                    autoComplete={"username"}
                    placeholder={"jhon doe"}
                    size={"lg"}
                    control={control}
                    rules={{ required: true }}
                    data-testid={"username"}
                  />
                </Box>

                <Box flexGrow={1}>
                  <Input
                    label={"Email"}
                    name={"email"}
                    type={"email"}
                    size={"lg"}
                    placeholder={"jhondoe@example.com"}
                    autoComplete={"email"}
                    control={control}
                    rules={{ required: true }}
                    data-testid={"email"}
                  />
                </Box>
              </Stack>

              <Stack direction={{ base: "column", sm: "row" }} spacing={6}>
                <Box flexGrow={1}>
                  <PasswordInput
                    label={"Password"}
                    name={"password"}
                    size={"lg"}
                    placeholder={"At least +4 chars"}
                    autoComplete={"new-password"}
                    control={control}
                    rules={{ required: true }}
                    data-testid={"password"}
                  />
                </Box>

                <Box flexGrow={1}>
                  <PasswordInput
                    label={"Confirm password"}
                    name={"passwordConfirm"}
                    size={"lg"}
                    placeholder={"••••••"}
                    autoComplete={"off"}
                    control={control}
                    rules={{ required: true }}
                    data-testid={"passwordConfirm"}
                  />
                </Box>
              </Stack>
            </VStack>

            <Button
              isLoading={isSubmitting}
              type={"submit"}
              data-testid={"submit"}
              size={"lg"}
              w={"full"}
              maxW={"lg"}
            >
              Create account
            </Button>
          </Stack>
        </Stack>
      </VStack>
    </Container>
  );
};
