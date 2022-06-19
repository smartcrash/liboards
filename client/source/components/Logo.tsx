import { Text, TextProps } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { APP_NAME } from "../constants";
import { route } from "../routes";

export const Logo = ({ ...textProps }: TextProps) => {
  return (
    <Link to={route("index")}>
      <Text fontSize={"2xl"} letterSpacing={1} fontFamily={"Lobster"} {...textProps}>
        {APP_NAME}
      </Text>
    </Link>
  );
};
