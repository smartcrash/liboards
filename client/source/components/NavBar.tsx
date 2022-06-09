import { AddIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
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
      <HStack spacing={10}>
        <Button leftIcon={<AddIcon fontSize={"xs"} />}>Create</Button>

        <Menu>
          <MenuButton>
            <HStack>
              <Text>{data.currentUser.username}</Text>
              <Avatar
                name={data.currentUser.username}
                bg={"gray.400"}
                size={"md"}
              />
            </HStack>
          </MenuButton>
          <MenuList>
            <MenuItem>
              <HStack>
                <Avatar name={data.currentUser.username} bg={"gray.400"} />
                <Box>
                  <Text fontSize={"sm"}>{data.currentUser.username}</Text>
                  <Text fontSize={"sm"} color={"gray.500"}>
                    {data.currentUser.email}
                  </Text>
                </Box>
              </HStack>
            </MenuItem>

            <MenuDivider />

            <MenuItem onClick={() => logout()} data-testid={"logout"}>
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
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
    <Box as={"nav"}>
      <HStack
        justifyContent={"space-between"}
        px={{ base: 2, sm: 6, lg: 8 }}
        h={20}
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
