import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Container,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Input, Link } from "../../components";
import { useSendResetPasswordEmailMutation } from "../../generated/graphql";

interface FieldValues {
  email: string;
}

export const ForgotPassword = () => {
  const [, sendResertPasswordEmail] = useSendResetPasswordEmailMutation();
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
    <Container
      maxW={"lg"}
      py={{ base: "12", md: "24" }}
      px={{ base: "4", sm: "8" }}
    >
      {!isSubmitSuccessful ? (
        <>
          <Stack spacing={8}>
            <Stack spacing={3}>
              <Heading size={"lg"}>Forgot password?</Heading>
              <Text color={"gray.500"}>
                No worries, enter the email associated with your account and
                we'll send you the instructions to reset your password.
              </Text>
            </Stack>

            <Box as={"form"} onSubmit={onSubmit}>
              <Stack spacing={6}>
                <Input
                  type={"email"}
                  label={"Email"}
                  autoComplete={"email"}
                  placeholder={"Enter your email"}
                  name={"email"}
                  control={control}
                  rules={{ required: true }}
                />

                <Button isLoading={isSubmitting} type={"submit"}>
                  Reset password
                </Button>

                <Link
                  leftIcon={<ArrowBackIcon />}
                  to={"/login"}
                  colorScheme={"gray"}
                >
                  Back to log in
                </Link>
              </Stack>
            </Box>
          </Stack>
        </>
      ) : (
        <>
          <Stack spacing={8}>
            <Alert
              status={"success"}
              variant={"subtle"}
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"center"}
              textAlign={"center"}
              height={"200px"}
            >
              <AlertIcon boxSize={"40px"} />
              <AlertTitle mt={6} mb={1} fontSize={"lg"}>
                Check your email!
              </AlertTitle>
              <AlertDescription>
                We have sent a password recover instruccions to your email.
              </AlertDescription>
            </Alert>

            <Text fontSize={"sm"} textAlign={"center"} color={"gray.500"}>
              Did not receive the email? Check your spam filter, or
              <Button
                variant={"link"}
                colorScheme={"gray"}
                size={"sm"}
                onClick={() => reset()}
              >
                try another email address.
              </Button>
            </Text>
          </Stack>
        </>
      )}
    </Container>
  );
};
