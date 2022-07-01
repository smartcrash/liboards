import { IconButton, useUpdateEffect } from "@chakra-ui/react";
import { useState } from "react";
import { HeartEmptyIcon, HeartIcon } from "../icons";

interface HeartButtonProps {
  defaultIsClick?: boolean;
  onClick?: (value: boolean) => void;
}

export const HeartButton = ({ defaultIsClick = false, onClick = () => {} }: HeartButtonProps) => {
  const [isClick, setClick] = useState(defaultIsClick);
  const Icon = isClick ? HeartIcon : HeartEmptyIcon;
  const onToggle = () => setClick((value) => !value);
  const ariaLabel = isClick ? "Remove from favorites" : "Add to favorites";

  useUpdateEffect(() => {
    onClick(isClick);
  }, [isClick]);

  return (
    <IconButton
      onClick={onToggle}
      icon={<Icon fontSize={"2xl"} fill={isClick ? "red.500" : "gray.400"} />}
      aria-label={ariaLabel}
      title={ariaLabel}
      colorScheme={"gray"}
      variant={"ghost"}
      size={"md"}
    />
  );
};
