import { HStack, Divider, Text, BoxProps } from "@chakra-ui/react";

export const DividerWithText = ({ children, ...props }: BoxProps) => {
  return (
    <HStack {...props}>
      <Divider />
      <Text fontSize="sm" whiteSpace="nowrap" color="muted">
        {children}
      </Text>
      <Divider />
    </HStack>
  );
};
