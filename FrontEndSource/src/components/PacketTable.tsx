import React from "react";
import ExpandableText from "./ExpandableText";
import { Text, useColorModeValue } from "@chakra-ui/react";

interface PacketData {
  [key: string]: any;
}

interface PacketTableProps {
  packets: PacketData[];
}

const columnNames = [
  "Index",
  "Time",
  "IP Source",
  "IP Destination",
  "MAC Source",
  "MAC Destination",
  "Protocol",
  "Additional",
];

const PacketTable: React.FC<PacketTableProps> = ({ packets }) => {
  const textColor = useColorModeValue("black", "white");

  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          {columnNames.map((name) => (
            <th key={name}>
              <Text color={textColor} fontSize="lg">
                {name}
              </Text>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {packets.map((packet, index) => (
          <tr key={index}>
            {Object.values(packet).map((value, idx) => (
              <td key={idx}>
                {typeof value === "string" && value.length > 20 ? (
                  <ExpandableText>{value}</ExpandableText>
                ) : (
                  <Text color={textColor} fontSize="lg">
                    {value}
                  </Text>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PacketTable;
