import { Divider, Stack } from "@chakra-ui/react";

export const TaskList = ({ children }: { children: any }) => {
  return (
    <Stack w={"full"} divider={<Divider borderColor={"gray.300"} />} spacing={2}>
      {children}
    </Stack>
  );
};
