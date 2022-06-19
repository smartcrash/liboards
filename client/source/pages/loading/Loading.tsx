import { Helmet } from "react-helmet";
import { Box } from "@chakra-ui/react";

export const Loading = () => {
  return (
    <>
      <Helmet title={"Loading..."} />
      {/* TODO: Be nicer */}
      <Box>Wait a little bitch</Box>;
    </>
  );
};
