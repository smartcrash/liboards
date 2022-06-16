import { Textarea, TextareaProps } from "@chakra-ui/react";
import ResizeTextarea, { TextareaAutosizeProps } from "react-textarea-autosize";
import React from "react";

export const AutoResizeTextarea = React.forwardRef<HTMLTextAreaElement, TextareaProps & TextareaAutosizeProps>(
  (props, ref) => {
    return (
      <Textarea
        minH="unset"
        overflow="hidden"
        w="100%"
        resize="none"
        ref={ref}
        minRows={1}
        as={ResizeTextarea}
        {...props}
      />
    );
  }
);
