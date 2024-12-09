// Chakra Imports
import { Button, Icon, useColorMode } from "@chakra-ui/react";
// Custom Icons
import { IoMdMoon, IoMdSunny } from "react-icons/io";
import React from "react";

/*************  ✨ Codeium Command ⭐  *************/
/**
 * FixedPlugin is a fixed-position button component that allows users
 * to toggle the color mode between light and dark themes. The button
 * is styled with a gradient background and is positioned at the bottom
 * of the viewport. It displays an icon that changes according to the
 * current color mode: a moon icon for light mode and a sun icon for
 * dark mode. The component accepts and spreads additional props to
 * the underlying Chakra UI Button component.
 *
 * @param {object} props - The properties passed to the component.
 */
/******  e24fe87b-e504-4131-b2c0-145d8fa1c00a  *******/export default function FixedPlugin(props) {
  const { ...rest } = props;
  const { colorMode, toggleColorMode } = useColorMode();
  let bgButton = "linear-gradient(135deg, #868CFF 0%, #4318FF 100%)";

  return (
    <Button
      {...rest}
      h='60px'
      w='60px'
      zIndex='99'
      bg={bgButton}
      position='fixed'
      variant='no-effects'
      left={document.documentElement.dir === "rtl" ? "35px" : ""}
      right={document.documentElement.dir === "rtl" ? "" : "35px"}
      bottom='30px'
      border='1px solid'
      borderColor='#6A53FF'
      borderRadius='50px'
      onClick={toggleColorMode}
      display='flex'
      p='0px'
      align='center'
      justify='center'>
      <Icon
        h='24px'
        w='24px'
        color='white'
        as={colorMode === "light" ? IoMdMoon : IoMdSunny}
      />
    </Button>
  );
}
