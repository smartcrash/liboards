import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useCurrentUserQuery, useLogoutMutation } from "../generated/graphql";

function NavBar() {
  const [, logout] = useLogoutMutation();
  const [{ data, fetching }] = useCurrentUserQuery();

  let leftElement = <></>;
  if (fetching) leftElement = <Spinner />;
  else if (data?.currentUser)
    leftElement = (
      <HStack spacing={5}>
        <Text fontWeight={"bold"}>{data.currentUser.username}</Text>
        <Button
          colorScheme={"gray"}
          variant={"outline"}
          fontWeight={"normal"}
          onClick={() => logout()}
        >
          Logout
        </Button>
      </HStack>
    );
  else
    leftElement = (
      <ButtonGroup spacing={4} size={"sm"}>
        <Button as={Link} to={"/login"} variant={"ghost"} colorScheme={"gray"}>
          Sign in
        </Button>
        <Button as={Link} to={"/signup"}>
          Create account
        </Button>
      </ButtonGroup>
    );

  return (
    <Box as={"nav"} bg={"gray.50"}>
      <HStack
        justifyContent={"space-between"}
        px={{ base: 2, sm: 6, lg: 8 }}
        h={16}
      >
        <Box>
          <Link to={"/"}>Liboards</Link>
        </Box>
        <Box>{leftElement}</Box>
      </HStack>
    </Box>
  );
}

export default NavBar;
