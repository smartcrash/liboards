import { Button } from "@chakra-ui/react";
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from "react-google-login";
import { GOOGLE_CLIENT_ID } from "../../constants";
import { GoogleIcon } from "./GoogleIcon";

interface GoogleLoginButtonProps {
  onSuccess: (response: GoogleLoginResponse) => void;
}

export const GoogleLoginButton = ({ onSuccess }: GoogleLoginButtonProps) => {
  const responseGoogle = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    if ("tokenId" in response) {
      onSuccess(response);
    } else {
      console.error(response);
    }
  };

  return (
    <GoogleLogin
      clientId={GOOGLE_CLIENT_ID}
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy={"single_host_origin"}
      render={(buttonProps) => (
        <Button variant={"outline"} colorScheme={"gray"} leftIcon={<GoogleIcon />} {...buttonProps}>
          Sign in with Google
        </Button>
      )}
    />
  );
};
