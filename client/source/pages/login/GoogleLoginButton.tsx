import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

interface GoogleLoginButtonProps {
  onSuccess: (tokenId: string) => void;
}

export const GoogleLoginButton = ({ onSuccess }: GoogleLoginButtonProps) => {
  const responseGoogle = ({ credential }: CredentialResponse) => {
    if (credential) onSuccess(credential);
  };

  return <GoogleLogin onSuccess={responseGoogle} useOneTap theme={"filled_blue"} />;
};
