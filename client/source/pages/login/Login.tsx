import { Helmet } from "react-helmet";
import { Box, Button, ButtonGroup, Heading, Hide, Spacer, Stack, Text, VStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Container, Input, Link, PasswordInput } from "../../components";
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
    <>
      <Helmet title={"Sign in"} />
      <Container pt={{ base: 16, sm: 24 }} pb={10} px={6} display={"flex"} h={"100vh"}>
        <VStack alignItems={"stretch"} flexGrow={1} spacing={{ base: 0, sm: 20 }}>
          <VStack alignItems={{ base: "flex-start", sm: "center" }}>
            <Heading fontSize={{ base: "5xl", sm: "5xl" }}>Welcome back!</Heading>
            <Text color={"gray.500"}>Login to your account</Text>
          </VStack>

          <Hide above={"sm"}>
            <Spacer />
          </Hide>

          <VStack
            as={"form"}
            onSubmit={onSubmit}
            spacing={{ base: 2, sm: 6 }}
            flexGrow={1}
            justifyContent={{ base: "space-between", sm: "flex-start" }}
          >
            <Stack direction={{ base: "column", sm: "row" }} spacing={6} w={"full"} maxW={"3xl"}>
              <Box flexGrow={1}>
                <Input
                  autoComplete={"email"}
                  label={"Username or email"}
                  placeholder={"Enter your username or email"}
                  name={"email"}
                  control={control}
                  rules={{ required: true }}
                  data-testid={"email"}
                  size={{ base: "lg", lg: "lg" }}
                />
              </Box>

              <Box flexGrow={1}>
                <VStack spacing={{ base: 4, sm: 6 }} alignItems={{ base: "flex-end", sm: "flex-start" }}>
                  <PasswordInput
                    label={"Password"}
                    autoComplete={"current-password"}
                    placeholder={"••••••"}
                    name={"password"}
                    control={control}
                    rules={{ required: true }}
                    data-testid={"password"}
                    size={{ base: "lg", lg: "lg" }}
                  />

                  <Link
                    to={route("forgotPwd")}
                    data-testid={"forgot-password"}
                    color={"blackAlpha"}
                    size={{ base: "md", md: "md" }}
                    textDecor={"underline"}
                  >
                    Forgot password?
                  </Link>
                </VStack>
              </Box>
            </Stack>

            <ButtonGroup
              flexDir={"column"}
              spacing={0}
              rowGap={3}
              size={{ base: "lg", md: "lg" }}
              w={"full"}
              maxW={"lg"}
            >
              <Button
                isLoading={isSubmitting}
                type={"submit"}
                data-testid={"submit"}
                bg={"gray.800"}
                _hover={{ bg: "gray.900" }}
                _active={{ bg: "gray.900" }}
              >
                Sign in
              </Button>

              <Button as={Link} to={route("signUp")} isDisabled={isSubmitting} data-testid={"go-to-signup"}>
                Create new account
              </Button>
            </ButtonGroup>
          </VStack>
        </VStack>
      </Container>
    </>
  );
};
