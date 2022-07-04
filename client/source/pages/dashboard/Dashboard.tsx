import { Box, Stack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import NavBar from "../../components/NavBar";

export const Dashboard = () => {
  return (
    <Stack h={"100vh"}>
      <NavBar />
      <Box as={"main"} px={0} pt={3} flexGrow={1}>
        <Outlet />
      </Box>
    </Stack>
  );
};
