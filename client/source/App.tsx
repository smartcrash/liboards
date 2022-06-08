import { Text } from "@chakra-ui/react";
import { Navigate, Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import { useCurrentUserQuery } from "./generated/graphql";

function App() {
  const [{ data, fetching }] = useCurrentUserQuery();

  if (fetching) return <Text>Loading</Text>;
  if (!data?.currentUser) return <Navigate to={"/login"} replace />;

  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

export default App;
