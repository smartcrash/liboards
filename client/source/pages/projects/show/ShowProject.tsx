import { Box } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import {
  useFindBoardByIdQuery,
  useUpdateBoardMutation,
} from "../../../generated/graphql";
import { EditableTitleAndDesc } from "./EditableTitleAndDesc";

export const ShowProject = () => {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id!);
  const [{ data, fetching }] = useFindBoardByIdQuery({ variables: { id } });
  const [, update] = useUpdateBoardMutation();

  if (fetching) return <>loading...</>; // TODO: Add skeleton
  if (!data?.board) return <>Something went wrong! :O</>;

  const { title, description } = data.board;

  return (
    <Box>
      <EditableTitleAndDesc
        defaultValues={{ title, description }}
        onSubmit={(nextValues) => update({ id, ...nextValues })}
      />
    </Box>
  );
};
