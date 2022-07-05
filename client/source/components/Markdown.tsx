import { Prose } from "@nikolovlazar/chakra-ui-prose";
import { BoxProps, Box } from "@chakra-ui/react";
import { forwardRef } from "react";
import ReactMarkdown from "react-markdown";

export const Markdown = forwardRef<HTMLDivElement, BoxProps>(({ children, ...props }, ref) => (
  <Box ref={ref} {...props}>
    <Prose>
      <ReactMarkdown skipHtml>{String(children)}</ReactMarkdown>
    </Prose>
  </Box>
));
