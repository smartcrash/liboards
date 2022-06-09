import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Container } from "../../components";
import NavBar from "../../components/NavBar";

export const Dashboard = () => {
  return (
    <Box>
      <NavBar />
      <Container>
        <Outlet />
      </Container>
    </Box>
  );
};
