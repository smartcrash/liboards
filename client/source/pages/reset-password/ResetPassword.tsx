import { Alert, AlertIcon, Button, Heading, Stack, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Container, PasswordInput } from "../../components";
import { useAuth } from "../../hooks/useAuth";
import { route } from "../../routes";

interface FieldValues {
  newPassword: string;
}

export const ResetPassword = () => {
  const { token = "" } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FieldValues>();

  const onSubmit = handleSubmit(async ({ newPassword }) => {
    setError(null);

    const response = await resetPassword(token, newPassword);

    if (response?.errors?.length) {
      const { errors } = response;
      setError(errors[0].message);
    } else navigate(route("login"));
  });

  return (
    <>
      <Helmet title={"Reset password"} />

      <Container pt={{ base: "12", md: "24" }} px={6} w={"full"} maxW={"2xl"} mx={"auto"}>
        <Stack spacing={10}>
          <VStack alignItems={"stretch"} textAlign={{ base: "left", sm: "center" }} spacing={6}>
            <Heading fontSize={{ base: "4xl", sm: "4xl" }}>Create new password</Heading>
            <Text color={"gray.500"}>Make sure that your new password is different from previous used passwords.</Text>
          </VStack>

          {error && (
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <Stack as={"form"} onSubmit={onSubmit} spacing={8}>
            <PasswordInput
              label={"Password"}
              autoComplete={"new-password"}
              name={"newPassword"}
              control={control}
              placeholder={"Must be least +4 chars"}
              data-testid={"newPassword"}
              size={"lg"}
            />

            <Button isLoading={isSubmitting} type={"submit"} data-testid={"submit"} size={"lg"}>
              Reset password
            </Button>
          </Stack>
        </Stack>
      </Container>
    </>
  );
};
