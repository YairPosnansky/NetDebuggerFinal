import React, { useState, useEffect } from "react";
import axios from "axios";
import Iframe from "../components/Iframe";
import {
  Box,
  Text,
  Heading,
  Input,
  Button,
  Grid,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  List,
  ListItem,
  Spinner,
} from "@chakra-ui/react";

const Diagnostics = () => {
  const [arpTable, setArpTable] = useState<string[][]>([]);
  const [tracerouteIP, setTracerouteIP] = useState("");
  const [tracerouteHops, setTracerouteHops] = useState<string[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoadingArpTable, setIsLoadingArpTable] = useState(false);
  const [isLoadingTraceroute, setIsLoadingTraceroute] = useState(false);

  useEffect(() => {
    const fetchArpTable = async () => {
      setIsLoadingArpTable(true);
      try {
        const response = await axios.get("/arp_table");
        setArpTable(response.data);
      } catch (error) {
        console.error("Error fetching ARP table:", error);
      }
      setIsLoadingArpTable(false);
    };

    fetchArpTable();
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleTraceroute = async () => {
    setIsLoadingTraceroute(true);
    try {
      const response = await axios.post("/traceroute", { ip: tracerouteIP });
      setTracerouteHops(response.data);
    } catch (error) {
      console.error("Error performing traceroute:", error);
    }
    setIsLoadingTraceroute(false);
  };

  const bgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("black", "white");

  return (
    <div>
      <Box maxW="32rem">
        <Heading mb={4}>Diagnostics Page 🩺</Heading>
        <Text fontSize="xl">Network Diagnostics Tool</Text>
      </Box>
      <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4}>
        <Box bg={bgColor} p={4} borderRadius="md" boxShadow="md">
          <Heading size="md" mb={4}>
            ARP Table
          </Heading>
          <Iframe>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>IP Address</Th>
                    <Th>MAC Address</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {arpTable.map((entry, index) => (
                    <Tr key={index}>
                      <Td>{entry[0]}</Td>
                      <Td>{entry[1]}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Iframe>
          <Button
            onClick={handleRefresh}
            mt={4}
            bg="#6AC26F"
            color="white"
            isLoading={isLoadingArpTable}
            loadingText="Refreshing..."
            spinnerPlacement="end"
            disabled={isLoadingArpTable}
          >
            Refresh
          </Button>
        </Box>
        <Box bg={bgColor} p={4} borderRadius="md" boxShadow="md">
          <Heading size="md" mb={4}>
            Traceroute
          </Heading>
          <Input
            placeholder="Enter IP Address"
            value={tracerouteIP}
            onChange={(e) => setTracerouteIP(e.target.value)}
            mb={4}
          />
          <Button
            onClick={handleTraceroute}
            bg="#6AC26F"
            color="white"
            mb={4}
            isLoading={isLoadingTraceroute}
            loadingText="Tracing..."
            spinnerPlacement="end"
            disabled={isLoadingTraceroute}
          >
            Traceroute
          </Button>
          <Iframe>
            <List spacing={3}>
              {tracerouteHops.map((hop, index) => (
                <ListItem key={index}>{hop}</ListItem>
              ))}
            </List>
          </Iframe>
        </Box>
      </Grid>
    </div>
  );
};

export default Diagnostics;
