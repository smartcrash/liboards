import { createIcon, IconButton, useUpdateEffect } from "@chakra-ui/react";
import { useState } from "react";

const HeartIcon = createIcon({
  displayName: "HeartIcon",
  viewBox: "0 0 24 24",
  path: (
    <path d="M12 10.375c0-2.416-1.959-4.375-4.375-4.375s-4.375 1.959-4.375 4.375c0 1.127.159 2.784 1.75 4.375l7 5.25s5.409-3.659 7-5.25 1.75-3.248 1.75-4.375c0-2.416-1.959-4.375-4.375-4.375s-4.375 1.959-4.375 4.375" />
  ),
});

const HeartEmptyIcon = createIcon({
  displayName: "HeartEmptyIcon",
  viewBox: "0 0 24 24",
  path: (
    <path d="M12 20c-.195 0-.391-.057-.561-.172-.225-.151-5.508-3.73-7.146-5.371-1.831-1.831-2.043-3.777-2.043-5.082 0-2.964 2.411-5.375 5.375-5.375 1.802 0 3.398.891 4.375 2.256.977-1.365 2.573-2.256 4.375-2.256 2.964 0 5.375 2.411 5.375 5.375 0 1.305-.212 3.251-2.043 5.082-1.641 1.641-6.923 5.22-7.146 5.371-.17.115-.366.172-.561.172zm-4.375-14c-1.861 0-3.375 1.514-3.375 3.375 0 1.093.173 2.384 1.457 3.668 1.212 1.212 4.883 3.775 6.293 4.746 1.41-.971 5.081-3.534 6.293-4.746 1.284-1.284 1.457-2.575 1.457-3.668 0-1.861-1.514-3.375-3.375-3.375s-3.375 1.514-3.375 3.375c0 .552-.447 1-1 1s-1-.448-1-1c0-1.861-1.514-3.375-3.375-3.375z" />
  ),
});

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
      icon={<Icon fontSize={"4xl"} fill={"red.500"} />}
      aria-label={ariaLabel}
      title={ariaLabel}
      colorScheme={"gray"}
      variant={"ghost"}
      size={"md"}
    />
  );
};
