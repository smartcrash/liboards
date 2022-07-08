import { Box, EditablePreview, EditableTextarea, Heading, Spacer, Stack, Text } from "@chakra-ui/react";
import { KeyboardEventHandler } from "react";
import { AutoResizeTextarea } from "../../AutoResizeTextarea";
import { EditableMarkdown } from "../../editable-markdown";
import { NonEmptyEditable } from "../../non-empty-editable";
import { useCardModalContext } from "./CardModal";

export const CardModalHeader = () => {
  const { card, updateCard } = useCardModalContext();
  const { id, title, description, column } = card;

  const blurOnEnterKeyDown: KeyboardEventHandler = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      (event.target as HTMLInputElement).blur();
    }
  };

  return (
    <>
      <Box>
        <NonEmptyEditable
          defaultValue={title}
          onSubmit={(value) => updateCard({ id, title: value })}
          fontSize={"3xl"}
          fontWeight={"bold"}
        >
          <EditablePreview lineHeight={"short"} maxW={"full"} />
          <EditableTextarea as={AutoResizeTextarea} px={0} onKeyDown={blurOnEnterKeyDown} />
        </NonEmptyEditable>

        <Text color={"gray.500"}>
          In column{" "}
          <Text as={"span"} textDecor={"underline"} fontWeight={"semibold"}>
            {column.title}
          </Text>
        </Text>
      </Box>

      <Spacer h={10} />

      <Stack spacing={3}>
        <Heading as={"h5"} size={"sm"}>
          Description
        </Heading>

        <EditableMarkdown defaultValue={description} onSubmit={(value) => updateCard({ id, description: value })} />
      </Stack>
    </>
  );
};
