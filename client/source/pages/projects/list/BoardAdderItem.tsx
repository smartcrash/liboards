import { Box, Center, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { route } from "../../../routes";

export const BoardAdderItem = () => {
  return (
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
  );
};
