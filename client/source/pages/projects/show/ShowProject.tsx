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
import { Sticky, StickyContainer } from "react-sticky";
import {
  Board,
  Card,
  CardDragEndHandler,
  CardModal,
  CardNewHandler,
  CardRemoveHandler,
  ColumnNewHandler,
  ColumnRemoveHandler,
  ColumnRenameHandler,
  HeartButton,
  NonEmptyEditable,
} from "../../../components";
import { CardType } from "../../../components/board/types";
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
  const { slug = "" } = useParams<{ slug: string }>();
  const id = parseInt(slug.slice(slug.lastIndexOf("-") + 1)); // Extract ID from slug
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

  const onTitleUpdate = async (title: string) => {
    const result = await updateBoard({ id, title });

    // Update the URL to show the new project's slug
    if (result.data?.board) {
      const newSlug = result.data.board.slug;
      const newUrl = route("projects.show", { slug: newSlug });

      // Change the url but don't a new add the entry to the browser history
      history.replaceState({}, "", newUrl);
    }
  };

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

  const onCardClick = (card: CardType) => {
    cardIdRef.current = card.id;
    onOpen();
  };

  return (
    <>
      <Helmet title={data.board.title} />

      <Stack as={StickyContainer} spacing={6} h={"full"}>
        <Sticky>
          {({ style, isSticky }) => (
            <HStack
              px={{ base: 2, sm: 6, lg: 8 }}
              justifyContent={"space-between"}
              style={style}
              bg={"white"}
              zIndex={1000}
              py={isSticky ? 2 : 0}
              borderBottomWidth={isSticky ? 2 : 0}
            >
              <HStack alignItems={"center"} spacing={3}>
                <NonEmptyEditable defaultValue={title} onSubmit={onTitleUpdate} fontSize={"3xl"} fontWeight={"bold"}>
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
                  <Button leftIcon={<TrashIcon mb={1} mr={1} />} colorScheme={"gray"} variant={"outline"}>
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
                        <Link
                          as={RouterLink}
                          to={route("projects.list")}
                          color={"gray.700"}
                          textDecoration={"underline"}
                        >
                          your projects page
                        </Link>
                      </Text>

                      <Button
                        colorScheme={"red"}
                        w={"full"}
                        size={"sm"}
                        onClick={onDelete}
                        data-testid={"delete-project"}
                      >
                        Delete
                      </Button>
                    </VStack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </HStack>
          )}
        </Sticky>

        <Box w={"full"} overflow={"auto"} mx={-10} pb={10} pt={1}>
          <Board
            renderCard={(card, { removeCard }) => (
              <Card id={card.id} onRemove={removeCard} onClick={() => onCardClick(card)} />
            )}
            onColumnNew={onColumnNew}
            onColumnRemove={onColumnRemove}
            onColumnRename={onColumnRename}
            onCardNew={onCardNew}
            onCardRemove={onCardRemove}
            onCardDragEnd={onCardDragEnd}
          >
            {data.board}
          </Board>
        </Box>
      </Stack>

      <CardModal id={cardIdRef.current} isOpen={isOpen} onClose={onClose} />
    </>
  );
};
