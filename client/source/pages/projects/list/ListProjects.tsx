import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Spacer,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
  useAllBoardsQuery,
  useAllDeletedBoardsQuery,
  useRestoreBoardMutation,
} from "../../../generated/graphql";
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

      {/* TODO: Turn into grid */}
      <HStack maxW={"full"} overflow={"scroll"} spacing={4}>
        {boards?.boards.map(({ id, title, description }) => (
          <Box
            w={60}
            h={28}
            p={5}
            bg={"primary.500"}
            color={"white"}
            borderRadius={"md"}
            borderWidth={1}
            shadow={"md"}
            as={Link}
            to={route("projects.show", { id })}
            flexShrink={0}
            key={id}
          >
            <VStack spacing={4} alignItems={"flex-start"}>
              <Heading fontSize={"xl"}>{title}</Heading>
              <Text>{description}</Text>
            </VStack>
          </Box>
        ))}

        <Box
          as={Link}
          to={route("projects.create")}
          w={60}
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
      </HStack>

      <Spacer />

      <Box mt={8}>
        <Button onClick={onToggle} variant={"link"}>
          View all deleted boards
        </Button>

        {/* TODO: Turn into grid */}
        <VStack
          alignItems={"flex-start"}
          spacing={4}
          mt={4}
          maxW={96}
          display={isOpen ? "block" : "none"}
        >
          {deletedBoards?.boards.map(({ id, title, description }) => (
            <HStack
              key={id}
              justifyContent={"space-between"}
              bg={"gray.200"}
              w={"full"}
              px={6}
              py={3}
              borderRadius={"md"}
              borderWidth={1}
              shadow={"md"}
              h={"20"}
            >
              <VStack alignItems={"flex-start"} spacing={0}>
                <Text fontSize={"md"}>{title}</Text>
                <Text fontSize={"sm"} color={"gray.500"}>
                  {description}
                </Text>
              </VStack>

              <Button
                colorScheme={"blackAlpha"}
                size={"sm"}
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
        </VStack>
      </Box>
    </Stack>
  );
};
