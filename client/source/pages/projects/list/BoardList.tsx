import { BoxProps, Grid } from "@chakra-ui/react";

export const BoardList = ({ children, ...props }: BoxProps) => {
  return (
    <Grid
      templateColumns={{
        base: "repeat(2, 1fr)",
        md: "repeat(auto-fit, minmax(100px, 240px))",
      }}
      gap={2}
      {...props}
    >
      {children}
    </Grid>
  );
};
