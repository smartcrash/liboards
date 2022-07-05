import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  Heading,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spacer,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { Helmet } from "react-helmet";
import { Container } from "../../../components";
import {
  useAllBoardsQuery,
  useAllDeletedBoardsQuery,
  useAllFavoritesQuery,
  useForceDeleteBoardMutation,
  useRestoreBoardMutation,
} from "../../../generated/graphql";
import { BoardAdderItem } from "./BoardAdderItem";
import { BoardItem } from "./BoardItem";
import { BoardList } from "./BoardList";

export const ListProjects = () => {
  const { isOpen, onToggle } = useDisclosure();

  const [{ data: boards }] = useAllBoardsQuery();
  const [{ data: favorites }] = useAllFavoritesQuery();
  const [{ data: deleted }] = useAllDeletedBoardsQuery();
  const [{ fetching: restoring }, restoreBoard] = useRestoreBoardMutation();
  const [{ fetching: deleting }, forceDeleteBoard] = useForceDeleteBoardMutation();

  // TODO: Add skeleton

  return (
    <>
      <Helmet title={"Projects"} />

      <Container h={"full"}>
        <Stack minH={"full"} mx={"auto"} maxW={"5xl"} pb={6}>
          <Stack spacing={8}>
            {favorites?.favorites.length && (
              <Box as={"section"}>
                <Heading fontSize={"2xl"} mb={4}>
                  Favorites
                </Heading>
                <BoardList data-testid="favorite-project-list">
                  {favorites?.favorites.map((board) => (
                    <BoardItem board={board} key={board.id} />
                  ))}
                </BoardList>
              </Box>
            )}

            <Box as={"section"}>
              <Heading fontSize={"2xl"} mb={4}>
                All projects
              </Heading>
              <BoardList data-testid="projects-list">
                {boards?.boards.map((board) => (
                  <BoardItem board={board} key={board.id} />
                ))}
                <BoardAdderItem />
              </BoardList>
            </Box>
          </Stack>
          <Spacer />

          <Box as={"section"} mt={8}>
            <Button onClick={onToggle} variant={"link"}>
              View all deleted boards
            </Button>

            <Box display={isOpen ? "block" : "none"}>
              <Grid
                templateColumns={{
                  base: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                }}
                gap={2}
                mt={4}
                data-testid="deleted-projects-list"
              >
                {deleted?.boards.map(({ id, title }) => (
                  <HStack
                    key={id}
                    justifyContent={"space-between"}
                    bg={"gray.200"}
                    px={6}
                    py={3}
                    h={20}
                    borderRadius={"md"}
                    borderWidth={1}
                    shadow={"md"}
                    data-testid={"deleted-project-item"}
                  >
                    <VStack alignItems={"flex-start"} spacing={0}>
                      <Text fontSize={"sm"}>{title}</Text>
                    </VStack>

                    <ButtonGroup size={"sm"} variant={"link"} spacing={6}>
                      <Popover>
                        <PopoverTrigger>
                          <Button colorScheme={"red"} isLoading={deleting} data-testid={"force-delete"}>
                            Delete
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <PopoverArrow />
                          <PopoverCloseButton />
                          <PopoverHeader>Are you absolutely sure?</PopoverHeader>

                          <PopoverBody>
                            <VStack spacing={3}>
                              <Text fontSize={"sm"} color={"gray.500"}>
                                This action cannot be undone. This will permanently delete the{" "}
                                <strong>{title} project</strong>, columns, cards, and remove all collaborator
                                associations.
                              </Text>

                              <Button
                                colorScheme={"red"}
                                w={"full"}
                                size={"sm"}
                                variant={"solid"}
                                onClick={() => forceDeleteBoard({ id })}
                                data-testid={"force-delete-project"}
                              >
                                Delete this project
                              </Button>
                            </VStack>
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>

                      <Button
                        colorScheme={"blackAlpha"}
                        onClick={() => restoreBoard({ id })}
                        isLoading={restoring}
                        data-testid={"restore-project"}
                      >
                        Restore
                      </Button>
                    </ButtonGroup>
                  </HStack>
                ))}

                {!deleted?.boards.length && (
                  <Text my={5} color={"gray.500"}>
                    No projects have been closed
                  </Text>
                )}
              </Grid>
            </Box>
          </Box>
        </Stack>
      </Container>
    </>
  );
};
