import { Box, Button, Grid, Heading, HStack, Spacer, Stack, Text, useDisclosure, VStack } from "@chakra-ui/react";
import {
  useAllBoardsQuery,
  useAllDeletedBoardsQuery,
  useAllFavoritesQuery,
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

  // TODO: Add skeleton

  return (
    <Stack minH={"full"} mx={"auto"} maxW={"5xl"} pb={6}>
      <Stack spacing={8}>
        {favorites?.favorites.length && (
          <Box as={"section"}>
            <Heading fontSize={"2xl"} mb={4}>
              Favorites
            </Heading>
            <BoardList>
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
          <BoardList>
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
              // sm: "repeat(auto-fit, minmax(100px, 300px))",
            }}
            gap={2}
            mt={4}
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
              >
                <VStack alignItems={"flex-start"} spacing={0}>
                  <Text fontSize={"md"}>{title}</Text>
                </VStack>

                <Button
                  colorScheme={"blue"}
                  size={"sm"}
                  variant={"link"}
                  onClick={() => restoreBoard({ id })}
                  isLoading={restoring}
                  data-testid={"restore"}
                >
                  Restore
                </Button>
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
  );
};
