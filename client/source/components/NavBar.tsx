import { AddIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { useAuth } from "../hooks/useAuth";
import { route } from "../routes";
import { Container } from "./";
import { Link } from "./Link";

function NavBar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <Container as={"nav"}>
      <HStack justifyContent={"space-between"} h={20}>
        <Link to={route("index")}>Liboards</Link>

        <HStack spacing={10}>
          <Link
            to={route("projects.create")}
            variant={"solid"}
            leftIcon={<AddIcon fontSize={"xs"} />}
            data-testid={"new-project"}
          >
            Create
          </Link>

          <Menu>
            <MenuButton>
              <HStack>
                <Text>{user.username}</Text>
                <Avatar name={user.username} bg={"gray.400"} size={"md"} />
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem>
                <HStack>
                  <Avatar name={user.username} bg={"gray.400"} />
                  <Box>
                    <Text fontSize={"sm"}>{user.username}</Text>
                    <Text fontSize={"sm"} color={"gray.500"}>
                      {user.email}
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
      </HStack>
    </Container>
  );
}

export default NavBar;
