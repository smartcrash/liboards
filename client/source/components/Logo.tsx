import { Text, TextProps } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { route } from "../routes";

export const Logo = ({ ...textProps }: TextProps) => {
  return (
    <Link to={route("index")}>
      <Text fontSize={"2xl"} letterSpacing={1} fontFamily={"Lobster"} {...textProps}>
        {import.meta.env.VITE_APP_NAME}
      </Text>
    </Link>
  );
};
