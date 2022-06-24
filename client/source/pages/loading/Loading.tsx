import { Helmet } from "react-helmet";
import { Box, Center, Spinner } from "@chakra-ui/react";

export const Loading = () => {
  return (
    <>
      <Helmet title={"Loading..."} />
      <Box w={"100vw"} h={"100vh"}>
        <Center h={"full"}>
          <Spinner color={"primary.500"} size={"xl"} thickness={"2px"} />
        </Center>
      </Box>
      ;
    </>
  );
};
