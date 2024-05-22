import React from "react";
import { Box } from "@chakra-ui/react";

interface IframeProps {
  children: React.ReactNode;
}

const Iframe: React.FC<IframeProps> = ({ children }) => {
  return (
    <Box
      borderWidth="4px"
      borderColor="#6AC26F"
      borderRadius="3xl"
      overflow="auto"
      maxHeight="500px"
      padding="4"
    >
      {children}
    </Box>
  );
};

export default Iframe;
