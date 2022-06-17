import { Box, VStack, Heading } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { route } from "../../../routes";

interface BoardItemProps {
  board: {
    id: number;
    title: string;
  };
}

export const BoardItem = ({ board: { id, title } }: BoardItemProps) => {
  return (
    <Link to={route("projects.show", { id })} key={id}>
      <Box h={28} p={5} bg={"primary.500"} color={"white"} borderRadius={"md"} borderWidth={1} shadow={"md"}>
        <VStack spacing={4} alignItems={"flex-start"}>
          <Heading fontSize={"xl"} maxW={"full"} textOverflow={"ellipsis"} whiteSpace={"nowrap"} overflow={"hidden"}>
            {title}
          </Heading>
        </VStack>
      </Box>
    </Link>
  );
};
