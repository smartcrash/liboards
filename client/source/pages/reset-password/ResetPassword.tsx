import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Container,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { PasswordInput } from "../../components";
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
    <Container
      maxW={"lg"}
      py={{ base: "12", md: "24" }}
      px={{ base: "4", sm: "8" }}
    >
      <Stack spacing={6}>
        <Stack spacing={3}>
          <Heading size={"lg"}>Create new password</Heading>
          <Text color={"gray.500"}>
            Make sure that your new password is different from previous used
            passwords.
          </Text>
        </Stack>

        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <Box as={"form"} onSubmit={onSubmit}>
          <Stack spacing={6}>
            <PasswordInput
              label={"Password"}
              autoComplete={"new-password"}
              name={"newPassword"}
              control={control}
              data-testid={"newPassword"}
            />

            <Button
              isLoading={isSubmitting}
              type={"submit"}
              data-testid={"submit"}
            >
              Reset password
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};
