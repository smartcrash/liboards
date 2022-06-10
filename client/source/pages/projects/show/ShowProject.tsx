import { Box, Heading, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useFindBoardByIdQuery } from "../../../generated/graphql";

export const ShowProject = () => {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id!);
  const [{ data, fetching }] = useFindBoardByIdQuery({ variables: { id } });

  if (fetching) return <>loading...</>; // TODO: Add skeleton
  if (!data?.board) return <>Something went wrong! :O</>;

  const { title, description } = data.board;

  return (
    <Box>
      <Heading>{title}</Heading>
      <Text>{description}</Text>
    </Box>
  );
};
