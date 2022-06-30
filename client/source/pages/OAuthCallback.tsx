import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLoginWithTokenMutation } from "../generated/graphql";
import { magic } from "../lib/magic";

export const OAuthCallback = () => {
  const location = useLocation();
  const [, loginWithToken] = useLoginWithTokenMutation();

  // The redirect contains a `provider` query param if the user is logging in with a social provider
  useEffect(() => {
    const provider = new URLSearchParams(location.search).get("provider");

    if (provider) finishSocialLogin();
  }, [location.search]);

  // `getRedirectResult()` returns an object with user data from Magic and the social provider
  const finishSocialLogin = async () => {
    const {
      magic: { idToken },
      oauth: { userInfo },
    } = await magic.oauth.getRedirectResult();

    await loginWithToken({
      token: idToken,
      userInfo: {
        email: userInfo.email!,
        name: userInfo.name!,
        picture: userInfo.picture!,
      },
    });
  };

  return <>Loading...</>;
};

export { OAuthCallback as default };
