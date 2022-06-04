import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

interface FieldValues {
  username: string;
  email: string;
  password: string;
}

export const SignUp = () => {
  const { register, handleSubmit } = useForm<FieldValues>({});
  const onSubmit = handleSubmit((data) => {
    console.log(data);
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
              {/* TODO: Redirect to /login */}
              <Button variant={"link"}>Login</Button>
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
              <FormControl>
                <FormLabel htmlFor={"username"}>Name</FormLabel>
                <Input
                  id={"username"}
                  {...register("username", { required: true })}
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor={"email"}>Email</FormLabel>
                <Input
                  id={"email"}
                  type={"email"}
                  autoComplete={"email"}
                  {...register("email", { required: true })}
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor={"password"}>Password</FormLabel>
                <Input
                  id={"password"}
                  type={"password"}
                  {...register("password", { required: true })}
                />
              </FormControl>
            </Stack>

            <Button type={"submit"}>Sign in</Button>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};
