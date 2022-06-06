import { Box, Button, ButtonGroup, HStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

function NavBar() {
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
        <Box>
          <ButtonGroup spacing={4} size={"sm"}>
            <Button
              as={Link}
              to={"/login"}
              variant={"ghost"}
              colorScheme={"gray"}
            >
              Sign in
            </Button>
            <Button as={Link} to={"/signup"}>
              Create account
            </Button>
          </ButtonGroup>
        </Box>
      </HStack>
    </Box>
  );
}

export default NavBar;
