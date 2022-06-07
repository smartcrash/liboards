import { Button, ButtonProps } from "@chakra-ui/react";
import { Link as RouterLink, To } from "react-router-dom";

interface LinkProps extends ButtonProps {
  reloadDocument?: boolean;
  replace?: boolean;
  state?: any;
  to: To;
}

export const Link = ({ children, ...props }: LinkProps) => {
  return (
    <Button as={RouterLink} variant={"link"} {...props}>
      {children}
    </Button>
  );
};
