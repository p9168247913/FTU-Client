import React, { createContext, useContext, useState } from "react";
import { Flex, Spinner, Text, useColorModeValue } from "@chakra-ui/react";

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
      {isLoading && <LoaderOverlay />}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);

const LoaderOverlay = () => {
  const bgColor = useColorModeValue("rgba(255, 255, 255, 0.8)", "rgba(0, 0, 0, 0.8)");

  return (
    <Flex
      position="fixed"
      top={0}
      left={0}
      width="100%"
      height="100%"
      bg={bgColor}
      justifyContent="center"
      alignItems="center"
      zIndex={1000}
    >
      <Spinner size="xl" color="blue.500" />
      <Text mt={4} fontSize="lg" color="blue.500">
        Loading...
      </Text>
    </Flex>
  );
};
