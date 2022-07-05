import { withProse } from '@nikolovlazar/chakra-ui-prose';
import {
  extendTheme,
  ThemeConfig
} from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    primary: {
      50: "#F0FFF4",
      100: "#C6F6D5",
      200: "#9AE6B4",
      300: "#68D391",
      400: "#48BB78",
      500: "#38A169",
      600: "#2F855A",
      700: "#276749",
      800: "#22543D",
      900: "#1C4532",
    },
  },

  components: {
    Button: { defaultProps: { colorScheme: 'primary' } },
    FormLabel: { baseStyle: { fontWeight: 'bold' } }
  }
}, withProse());

export default theme
