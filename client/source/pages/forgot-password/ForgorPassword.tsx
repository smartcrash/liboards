import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  ButtonGroup,
  Heading,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Container, Input } from "../../components";
import { useAuth } from "../../hooks/useAuth";
import { route } from "../../routes";

interface FieldValues {
  email: string;
}

export const ForgotPassword = () => {
  const { sendResertPasswordEmail } = useAuth();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm<FieldValues>();
  const onSubmit = handleSubmit(async ({ email }) => {
    await sendResertPasswordEmail({ email });
  });

  return (
    <Container pt={{ base: "12", md: "24" }} px={6} w={"full"} maxW={"2xl"} mx={"auto"}>
      {!isSubmitSuccessful ? (
        <Stack spacing={10}>
          <VStack alignItems={"stretch"} textAlign={{ base: "left", sm: "center" }} spacing={6}>
            <Heading fontSize={{ base: "4xl", sm: "4xl" }}>Forgot password?</Heading>
            <Text color={"gray.500"}>
              No worries, enter the email associated with your account and we'll send you the instructions to reset your
              password.
            </Text>
          </VStack>

          <VStack as={"form"} onSubmit={onSubmit} spacing={8} alignItems={"stretch"}>
            <Input
              type={"email"}
              label={"Email"}
              autoComplete={"email"}
              placeholder={"Enter your email"}
              size={"lg"}
              name={"email"}
              control={control}
              rules={{ required: true }}
              data-testid={"email"}
            />

            <ButtonGroup flexDir={"column"} spacing={0} rowGap={3}>
              <Button isLoading={isSubmitting} type={"submit"} data-testid={"submit"} size={"lg"}>
                Reset password
              </Button>

              <Button as={Link} to={route("login")} leftIcon={<ArrowBackIcon />} colorScheme={"gray"}>
                Back to log in
              </Button>
            </ButtonGroup>
          </VStack>
        </Stack>
      ) : (
        <Stack spacing={8} data-testid={"success"}>
          <Heading>Check your email!</Heading>
          <Text>
            We have sent a password recover instruccions to your email.
            <br />
            Did not receive the email? Check your spam filter, or{" "}
            <Button variant={"link"} color={"gray.800"} onClick={() => reset()}>
              try another email address.
            </Button>
          </Text>
        </Stack>
      )}
    </Container>
  );
};
