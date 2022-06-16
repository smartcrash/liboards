import { Stack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Container } from "../../components";
import NavBar from "../../components/NavBar";

export const Dashboard = () => {
  return (
    <Stack h={"100vh"}>
      <NavBar />
      <Container flexGrow={1} pt={6}>
        <Outlet />
      </Container>
    </Stack>
  );
};
