import { Box, Heading, HStack, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useAllBoardsQuery } from "../../../generated/graphql";

export const ListProjects = () => {
  const [{ data }] = useAllBoardsQuery();

  // TODO: Add skeleton
  // TODO: Make draggable?

  return (
    <Box mx={"auto"} maxW={"5xl"}>
      <Heading fontSize={"2xl"} mb={6}>
        All projects
      </Heading>
      <HStack maxW={"full"} overflow={"scroll"}>
        {data?.boards.map(({ id, title, description }) => (
          <Box
            w={60}
            h={28}
            p={5}
            shadow={"md"}
            borderWidth={1}
            bg={"primary.500"}
            color={"white"}
            borderRadius={"md"}
            as={Link}
            to={`/p/${id}`}
            flexShrink={0}
          >
            <Heading fontSize={"xl"}>{title}</Heading>
            <Text mt={4}>{description}</Text>
          </Box>
        ))}
      </HStack>
    </Box>
  );
};
