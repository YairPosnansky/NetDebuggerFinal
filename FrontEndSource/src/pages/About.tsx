import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Heading,
  Text,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";

const About = () => {
  const [pdfUrl, setPdfUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await axios.get("/pdf", {
          responseType: "blob",
        });
        const url = URL.createObjectURL(response.data);
        setPdfUrl(url);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching PDF:", error);
        setIsLoading(false);
      }
    };

    fetchPdf();
  }, []);

  const bgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("black", "white");

  return (
    <Box maxW="800px" mx="auto" p={8}>
      <Heading as="h1" size="2xl" mb={4}>
        Docs
      </Heading>
      {isLoading ? (
        <Spinner size="xl" />
      ) : (
        <Box
          as="iframe"
          src={pdfUrl}
          width="100%"
          height="600px"
          title="About Us PDF"
          borderRadius="md"
          boxShadow="md"
          bg={bgColor}
          color={textColor}
        />
      )}
    </Box>
  );
};

export default About;
