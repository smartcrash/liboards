import { AddIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Hide,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { route } from "../routes";
import { Container, Logo } from "./";

function NavBar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const onLogout = async () => {
    await logout();

    // After logout we force a reload of the page to invalidate the whole cache.
    // See: https://github.com/FormidableLabs/urql/issues/2511
    window.location.reload();
  };

  return (
    <Container as={"nav"} bg={"primary.500"} w={"full"}>
      <HStack justifyContent={"space-between"} h={16}>
        <Logo color={"white"} />

        <HStack spacing={6}>
          <Button
            as={RouterLink}
            to={route("projects.create")}
            variant={"ghost"}
            bg={"white"}
            size={"sm"}
            leftIcon={<AddIcon fontSize={"sm"} ml={2} />}
            iconSpacing={2}
            title={"Create project"}
            data-testid={"new-project"}
          >
            <Hide below={"sm"}>Create project</Hide>
          </Button>

          <Menu>
            <MenuButton>
              <HStack>
                <Text color={"white"} fontWeight={"semibold"} fontSize={"sm"}>
                  {user.userName}
                </Text>
                <Avatar name={user.userName} bg={"gray.100"} color={"black"} size={"sm"} />
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem>
                <HStack>
                  <Avatar name={user.userName} bg={"primary.500"} />
                  <Box>
                    <Text fontSize={"sm"}>{user.userName}</Text>
                    <Text fontSize={"sm"} color={"gray.500"}>
                      {user.email}
                    </Text>
                  </Box>
                </HStack>
              </MenuItem>

              <MenuDivider />

              <MenuItem onClick={onLogout} data-testid={"logout"}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </HStack>
    </Container>
  );
}

export default NavBar;
