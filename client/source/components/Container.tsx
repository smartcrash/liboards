import { Box, BoxProps } from "@chakra-ui/react";

interface ContainerProps extends BoxProps {}

export const Container = ({ children, ...props }: ContainerProps) => {
  return (
    <Box px={{ base: 2, sm: 6, lg: 8 }} mx={"auto"} {...props}>
      {children}
    </Box>
  );
};
