import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import Iframe from "../components/Iframe";
import PacketTable from "../components/PacketTable";
import {
  Box,
  Text,
  Heading,
  Input,
  Select,
  Button,
  Grid,
  useColorModeValue,
  Spinner,
  CircularProgress,
  useToast,
} from "@chakra-ui/react";

interface PacketData {
  [key: number]: any;
}

const Sniffer = () => {
  const [sourceIP, setSourceIP] = useState("");
  const [sourceMAC, setSourceMAC] = useState("");
  const [destinationIP, setDestinationIP] = useState("");
  const [destinationMAC, setDestinationMAC] = useState("");
  const [protocol, setProtocol] = useState("");
  const [packets, setPackets] = useState<PacketData[]>([]);
  const [filteredPackets, setFilteredPackets] = useState<PacketData[]>([]);
  const [tableList, setTableList] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [isSnifferRunning, setIsSnifferRunning] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchTableList = async () => {
      try {
        const response = await axios.get("/tableList");
        const tables = response.data;
        setTableList(tables);
        setSelectedTable(tables[tables.length - 1]); // Set the default table to the latest one
      } catch (error) {
        console.error("Error fetching table list:", error);
      }
    };

    fetchTableList();
  }, [refreshKey]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/table/${selectedTable}`);
        const fetchedPackets = response.data;
        setPackets(fetchedPackets);
        setFilteredPackets(fetchedPackets);
        console.log("Fetched packets:", fetchedPackets);
      } catch (error) {
        console.error("Error fetching packet data:", error);
      }
    };

    if (selectedTable) {
      fetchData();
    }
  }, [selectedTable, refreshKey]);

  const handleFilter = () => {
    console.log("Filter values:", {
      sourceIP,
      sourceMAC,
      destinationIP,
      destinationMAC,
      protocol,
    });
    console.log("Packets before filtering:", packets);

    const filtered = packets.filter((packet) => {
      console.log("Packet:", packet);

      const matchesSourceIP = sourceIP
        ? packet[2].toLowerCase().includes(sourceIP.toLowerCase())
        : true;
      const matchesSourceMAC = sourceMAC
        ? packet[4].toLowerCase().includes(sourceMAC.toLowerCase())
        : true;
      const matchesDestinationIP = destinationIP
        ? packet[3].toLowerCase().includes(destinationIP.toLowerCase())
        : true;
      const matchesDestinationMAC = destinationMAC
        ? packet[5].toLowerCase().includes(destinationMAC.toLowerCase())
        : true;
      const matchesProtocol = protocol
        ? packet[6].toLowerCase() === protocol.toLowerCase()
        : true;

      console.log("Matches:", {
        matchesSourceIP,
        matchesSourceMAC,
        matchesDestinationIP,
        matchesDestinationMAC,
        matchesProtocol,
      });

      return (
        matchesSourceIP &&
        matchesSourceMAC &&
        matchesDestinationIP &&
        matchesDestinationMAC &&
        matchesProtocol
      );
    });

    setFilteredPackets(filtered);
    console.log("Filtered packets:", filtered);
  };

  const handleStartStopSniffer = async () => {
    try {
      if (isSnifferRunning) {
        await axios.post("/stop_sniffer");
        setIsSnifferRunning(false);
      } else {
        await axios.post("/start_sniffer");
        setIsSnifferRunning(true);
      }
      setRefreshKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error("Error starting/stopping sniffer:", error);
    }
  };

  const fetchSnifferStatus = async () => {
    try {
      const response = await axios.get("/is_sniffer_running");
      setIsSnifferRunning(response.data.is_running);
    } catch (error) {
      console.error("Error fetching sniffer status:", error);
    }
  };

  useEffect(() => {
    fetchSnifferStatus();
  }, []);

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleDownloadHistory = async () => {
    setIsDownloading(true);
    try {
      const response = await axios.get("/db", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "sniffer_history.db");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading history:", error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.status === 404) {
          toast({
            title: "File Not Found",
            description: "The history file was not found on the server.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Download Error",
            description:
              "An error occurred while downloading the history file.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } else {
        toast({
          title: "Download Error",
          description:
            "An unknown error occurred while downloading the history file.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
    setIsDownloading(false);
  };

  const textColor = useColorModeValue("black", "white");

  return (
    <div>
      <Box maxW="32rem">
        <Heading mb={4}>Sniffer Page 👃</Heading>
        <Text fontSize="xl">A Simple CRUD Based Sniffer</Text>
      </Box>
      <Grid templateColumns="repeat(5, 1fr)" gap={4} mb={4}>
        <Input
          placeholder="Source IP"
          value={sourceIP}
          onChange={(e) => setSourceIP(e.target.value)}
        />
        <Input
          placeholder="Source MAC"
          value={sourceMAC}
          onChange={(e) => setSourceMAC(e.target.value)}
        />
        <Input
          placeholder="Destination IP"
          value={destinationIP}
          onChange={(e) => setDestinationIP(e.target.value)}
        />
        <Input
          placeholder="Destination MAC"
          value={destinationMAC}
          onChange={(e) => setDestinationMAC(e.target.value)}
        />
        <Select
          placeholder="Protocol"
          value={protocol}
          onChange={(e) => setProtocol(e.target.value)}
        >
          <option value="">All</option>
          <option value="TCP">TCP</option>
          <option value="UDP">UDP</option>
          <option value="ARP">ARP</option>
          <option value="ICMP">ICMP</option>
        </Select>
      </Grid>
      <Box display="flex" alignItems="center" mb={4}>
        <Button onClick={handleFilter} mr={4}>
          Filter
        </Button>
        <Select
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
        >
          {tableList.map((table) => (
            <option key={table} value={table}>
              {table}
            </option>
          ))}
        </Select>
        <Button
          onClick={handleStartStopSniffer}
          ml={4}
          colorScheme={isSnifferRunning ? "red" : "blue"}
          leftIcon={isSnifferRunning ? <Spinner size="sm" /> : undefined}
        >
          {isSnifferRunning ? "Stop Sniffing" : "Start Sniffing"}
        </Button>
        <Button onClick={handleRefresh} ml={4} bg="#6AC26F" color="white">
          Refresh
        </Button>
        <Button
          onClick={handleDownloadHistory}
          ml={4}
          bg="#3477eb"
          color="white"
          disabled={isDownloading}
          px={4}
        >
          {isDownloading ? (
            <CircularProgress isIndeterminate size="24px" color="white" />
          ) : (
            "Download"
          )}
        </Button>
      </Box>
      <Iframe key={refreshKey}>
        {filteredPackets.length > 0 ? (
          <PacketTable packets={filteredPackets} />
        ) : (
          <Text color="red" fontSize="xl">
            NO PACKETS FOUND {"No Skibidi Rizz :("}
          </Text>
        )}
      </Iframe>
    </div>
  );
};

export default Sniffer;
