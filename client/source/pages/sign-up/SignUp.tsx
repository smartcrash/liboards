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
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../components/Input";
import { useCreateUserMutation } from "../../generated/graphql";

interface FieldValues {
  username: string;
  email: string;
  password: string;
}

export const SignUp = () => {
  const [, createUser] = useCreateUserMutation();
  const navigate = useNavigate();
  const {
    handleSubmit,
    setError,
    control,
    formState: { isSubmitting, errors },
  } = useForm<FieldValues>({});
  const onSubmit = handleSubmit(async (values) => {
    const response = await createUser(values);

    if (response.data?.createUser) {
      const { user, errors } = response.data.createUser;

      if (errors?.length) {
        errors.forEach(({ field, message }) =>
          setError(field as any, { message })
        );
      } else if (user) {
        navigate("/", { replace: true });
      }
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
              <Button as={Link} to={"/login"} variant={"link"}>
                Login
              </Button>
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
              />

              <Input
                label={"Email"}
                name={"email"}
                type={"email"}
                autoComplete={"email"}
                control={control}
                rules={{ required: true }}
              />

              <Input
                label={"Password"}
                name={"password"}
                type={"password"}
                autoComplete={"password"}
                control={control}
                rules={{ required: true }}
              />
            </Stack>

            <Button isLoading={isSubmitting} type={"submit"}>
              Sign up
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};
