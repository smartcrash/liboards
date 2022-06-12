import {
  forwardRef,
  Link as ChakraLink,
  LinkProps as ChakraLinkProps,
} from "@chakra-ui/react";
import { Link as RouterLink, To } from "react-router-dom";

interface LinkProps extends ChakraLinkProps {
  reloadDocument?: boolean;
  replace?: boolean;
  state?: any;
  to: To;
}

export const Link = forwardRef(({ children, ...props }: LinkProps, ref) => {
  return (
    <ChakraLink as={RouterLink} ref={ref} {...props}>
      {children}
    </ChakraLink>
  );
});
