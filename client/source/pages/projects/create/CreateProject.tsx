import { Button, Container, Heading, Stack, Text } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Input } from "../../../components";
import { useCreateBoardMutation } from "../../../generated/graphql";
import { route } from "../../../routes";

interface FieldValues {
  title: string;
}

export const CreateProject = () => {
  const [, createBoard] = useCreateBoardMutation();
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<FieldValues>({});

  const onSubmit = handleSubmit(async ({ title }) => {
    const { data, error } = await createBoard({ title });

    if (data?.board.id) {
      const id = data?.board.id;
      navigate(route("projects.show", { id }));
    } else {
      // Something went wrong! :O
      console.error("Error at `createBoard` muration", { data, error });
    }
  });

  return (
    <Container maxW={"lg"}>
      <Stack mb={12}>
        <Heading fontSize={"3xl"}>Create new project</Heading>
        <Text color={"gray.500"}>
          A project contains a board, and a board is made up of cards ordered on lists. Use it to manage your project,
          track information, or organize antthing.
        </Text>
      </Stack>

      <Stack as={"form"} onSubmit={onSubmit} spacing={6}>
        <Input
          label={"Project name"}
          name={"title"}
          control={control}
          rules={{ required: true }}
          autoFocus
          data-testid={"title"}
        />

        <Button isDisabled={isSubmitting} type={"submit"} data-testid={"submit"}>
          Create project
        </Button>
      </Stack>
    </Container>
  );
};
