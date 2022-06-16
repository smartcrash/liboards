import {
  Box,
  Button,
  Center,
  Grid,
  Heading,
  HStack,
  Spacer,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useAllBoardsQuery, useAllDeletedBoardsQuery, useRestoreBoardMutation } from "../../../generated/graphql";
import { route } from "../../../routes";

export const ListProjects = () => {
  const { isOpen, onToggle } = useDisclosure();

  const [{ data: boards }] = useAllBoardsQuery();
  const [{ data: deletedBoards }] = useAllDeletedBoardsQuery();
  const [{ fetching: restoring }, restoreBoard] = useRestoreBoardMutation();

  // TODO: Add skeleton
  // TODO: Make draggable?

  return (
    <Stack minH={"full"} mx={"auto"} maxW={"5xl"} pb={6}>
      <Heading fontSize={"2xl"} mb={6}>
        All projects
      </Heading>

      <Grid
        templateColumns={{
          base: "repeat(2, 1fr)",
          md: "repeat(auto-fit, minmax(100px, 240px))",
        }}
        gap={2}
      >
        {boards?.boards.map(({ id, title }) => (
          <Link to={route("projects.show", { id })} key={id}>
            <Box h={28} p={5} bg={"primary.500"} color={"white"} borderRadius={"md"} borderWidth={1} shadow={"md"}>
              <VStack spacing={4} alignItems={"flex-start"}>
                <Heading fontSize={"xl"}>{title}</Heading>
              </VStack>
            </Box>
          </Link>
        ))}

        <Link to={route("projects.create")}>
          <Box
            h={28}
            p={5}
            bg={"gray.100"}
            _hover={{ bg: "gray.200" }}
            borderRadius={"md"}
            borderWidth={1}
            shadow={"md"}
            flexShrink={0}
          >
            <Center h={"full"}>
              <Text>Create new project</Text>
            </Center>
          </Box>
        </Link>
      </Grid>

      <Spacer />

      <Box mt={8}>
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
            {deletedBoards?.boards.map(({ id, title }) => (
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

            {!deletedBoards?.boards.length && (
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
