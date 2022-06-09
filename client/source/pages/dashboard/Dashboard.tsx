import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import NavBar from "../../components/NavBar";

export const Dashboard = () => {
  return (
    <Box>
      <NavBar />
      <Outlet />
    </Box>
  );
};
