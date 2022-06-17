import { Grid } from "@chakra-ui/react";

export const BoardList = ({ children }: { children: any }) => {
  return (
    <Grid
      templateColumns={{
        base: "repeat(2, 1fr)",
        md: "repeat(auto-fit, minmax(100px, 240px))",
      }}
      gap={2}
    >
      {children}
    </Grid>
  );
};
