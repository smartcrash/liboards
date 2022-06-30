import { Button, ButtonProps } from "@chakra-ui/react";
import { GoogleIcon } from "./GoogleIcon";

export const GoogleLoginButton = (props: ButtonProps) => {
  return (
    <Button variant={"outline"} colorScheme={"gray"} leftIcon={<GoogleIcon />} {...props}>
      Sign in with Google
    </Button>
  );
};
