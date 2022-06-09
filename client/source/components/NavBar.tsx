import { AddIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function NavBar() {
  const { user, logout } = useAuth();

  if (!user) return null;

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
        <Box>
          <HStack spacing={10}>
            <Button leftIcon={<AddIcon fontSize={"xs"} />}>Create</Button>

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
        </Box>
      </HStack>
    </Box>
  );
}

export default NavBar;
