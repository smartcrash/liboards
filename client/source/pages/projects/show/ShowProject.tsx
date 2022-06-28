import {
  Box,
  Button,
  EditableInput,
  EditablePreview,
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
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useRef } from "react";
import { Helmet } from "react-helmet";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import {
  Board,
  CardClickHandler,
  CardDetailsModal,
  CardDragEndHandler,
  CardNewHandler,
  CardRemoveHandler,
  ColumnNewHandler,
  ColumnRemoveHandler,
  ColumnRenameHandler,
  HeartButton,
  NonEmptyEditable,
} from "../../../components";
import {
  useAddCardMutation,
  useAddColumnMutation,
  useAddToFavoritesMutation,
  useDeleteBoardMutation,
  useFindBoardByIdQuery,
  useMoveCardMutation,
  useRemoveCardMutation,
  useRemoveColumnMutation,
  useRemoveFromFavoritesMutation,
  useUpdateBoardMutation,
  useUpdateColumnMutation,
} from "../../../generated/graphql";
import { TrashIcon } from "../../../icons";
import { route } from "../../../routes";

export const ShowProject = () => {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id!);
  const [{ data, fetching }] = useFindBoardByIdQuery({ variables: { id } });
  const [, updateBoard] = useUpdateBoardMutation();
  const [, addToFavorites] = useAddToFavoritesMutation();
  const [, removeFromFavorites] = useRemoveFromFavoritesMutation();
  const [, deleteBoard] = useDeleteBoardMutation();
  const [, addColumn] = useAddColumnMutation();
  const [, updateColumn] = useUpdateColumnMutation();
  const [, addCard] = useAddCardMutation();
  const [, removeColumn] = useRemoveColumnMutation();
  const [, removeCard] = useRemoveCardMutation();
  const [, moveCard] = useMoveCardMutation();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cardIdRef = useRef<number>();

  if (fetching) return <>loading...</>; // TODO: Add skeleton
  if (!data?.board) return <>Something went wrong! :O</>;

  const { title, favorite } = data.board;

  const onDelete = async () => {
    await deleteBoard({ id });
    navigate(route("index"), { replace: true });
  };

  const onColumnNew: ColumnNewHandler = async (newColumn) => {
    const { data } = await addColumn({
      ...newColumn,
      boardId: id,
    });

    return data!.column;
  };

  const onColumnRemove: ColumnRemoveHandler = async ({ id }) => {
    await removeColumn({ id });
  };

  const onColumnRename: ColumnRenameHandler = async ({ id, title }) => {
    await updateColumn({ id, title });
  };

  const onCardNew: CardNewHandler = async (newCard) => {
    const { data } = await addCard({ ...newCard });

    return data!.card;
  };

  const onCardRemove: CardRemoveHandler = async ({ id }) => {
    await removeCard({ id });
  };

  const onCardDragEnd: CardDragEndHandler = async ({ cardId, toIndex, toColumnId }) => {
    await moveCard({ id: cardId, toIndex, toColumnId });
  };

  const onCardClick: CardClickHandler = (card) => {
    cardIdRef.current = card.id;
    onOpen();
  };

  return (
    <>
      <Helmet title={data.board.title} />

      <Stack spacing={6}>
        <HStack justifyContent={"space-between"}>
          <HStack alignItems={"flex-start"} spacing={3}>
            <NonEmptyEditable
              defaultValue={title}
              onSubmit={(title) => updateBoard({ id, title })}
              fontSize={"3xl"}
              fontWeight={"bold"}
            >
              <EditablePreview />
              <EditableInput data-testid={"title"} />
            </NonEmptyEditable>

            <HeartButton
              defaultIsClick={favorite}
              onClick={(value) => (value ? addToFavorites({ id }) : removeFromFavorites({ id }))}
            />
          </HStack>

          <Popover>
            <PopoverTrigger>
              <Button leftIcon={<TrashIcon mb={1} mr={1} />} colorScheme={"gray"} variant={"ghost"}>
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
                      your projects page
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
            onColumnRename={onColumnRename}
            onCardNew={onCardNew}
            onCardRemove={onCardRemove}
            onCardDragEnd={onCardDragEnd}
            onCardClick={onCardClick}
          >
            {data.board}
          </Board>
        </Box>
      </Stack>

      <CardDetailsModal id={cardIdRef.current} isOpen={isOpen} onClose={onClose} />
    </>
  );
};
