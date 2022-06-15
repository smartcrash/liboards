import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  HStack,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { Board, CardDragEndHandler, CardNewHandler, ColumnNewHandler, ColumnRemoveHandler } from "../../../components";
import {
  useAddCardMutation,
  useAddColumnMutation,
  useDeleteBoardMutation,
  useFindBoardByIdQuery,
  useMoveCardMutation,
  useRemoveColumnMutation,
  useUpdateBoardMutation,
} from "../../../generated/graphql";
import { route } from "../../../routes";
import { EditableTitleAndDesc } from "./EditableTitleAndDesc";

export const ShowProject = () => {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id!);
  const [{ data, fetching }] = useFindBoardByIdQuery({ variables: { id } });
  const [, update] = useUpdateBoardMutation();
  const [, deleteBoard] = useDeleteBoardMutation();
  const [, addColumn] = useAddColumnMutation();
  const [, addCard] = useAddCardMutation();
  const [, removeColumn] = useRemoveColumnMutation();
  const [, moveCard] = useMoveCardMutation();

  if (fetching) return <>loading...</>; // TODO: Add skeleton
  if (!data?.board) return <>Something went wrong! :O</>;

  const { title, description } = data.board;

  const onDelete = async () => {
    await deleteBoard({ id });
    navigate(route("index"), { replace: true });
  };

  const onColumnNew: ColumnNewHandler = async (newColumn) => {
    const { data, error } = await addColumn({
      ...newColumn,
      boardId: id,
    });

    if (!data) {
      throw new Error("Error at `addColumn` mutation", error);
    }

    return data.column;
  };

  const onColumnRemove: ColumnRemoveHandler = async ({ id }) => {
    await removeColumn({ id });
  };

  const onCardNew: CardNewHandler = async (newCard) => {
    const { data, error } = await addCard({ ...newCard });

    if (!data) {
      throw new Error("Error at `addColumn` mutation", error);
    }

    return data.card;
  };

  const onCardDragEnd: CardDragEndHandler = async ({ cardId, toIndex, toColumnId }) => {
    await moveCard({ id: cardId, toIndex, toColumnId });
  };

  return (
    <Stack spacing={6}>
      <HStack justifyContent={"space-between"}>
        <EditableTitleAndDesc
          defaultValues={{ title, description }}
          onSubmit={(nextValues) => update({ id, ...nextValues })}
        />

        <Popover>
          <PopoverTrigger>
            <Button leftIcon={<DeleteIcon mb={1} mr={1} />} colorScheme={"gray"} variant={"ghost"}>
              Delete project
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader textAlign={"center"}>Delete project?</PopoverHeader>
            <PopoverBody>
              <VStack spacing={3}>
                <Text fontSize={"sm"} color={"gray.500"}>
                  You can find and reopen closed boards at the bottom of{" "}
                  <Link as={RouterLink} to={route("projects.list")} color={"gray.700"} textDecoration={"underline"}>
                    your boards page
                  </Link>
                </Text>

                <Button colorScheme={"red"} w={"full"} size={"sm"} onClick={onDelete} data-testid={"delete"}>
                  Delete
                </Button>
              </VStack>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </HStack>

      <Box>
        <Board
          onColumnNew={onColumnNew}
          onColumnRemove={onColumnRemove}
          onCardNew={onCardNew}
          onCardDragEnd={onCardDragEnd}
        >
          {data.board}
        </Board>
      </Box>
    </Stack>
  );
};
