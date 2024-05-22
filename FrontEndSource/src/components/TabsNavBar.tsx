import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import React from "react";
import Sniffer from "../pages/Sniffer";
import About from "../pages/About";
import Diagnostics from "../pages/Diagnostics";
import DarkModeButton from "./DarkModeButton";

const TabsNavBar = () => {
  const textColor = useColorModeValue("gray", "white");
  const selectedTextColor = useColorModeValue("black", "lightGreen");
  const selectedColor = useColorModeValue("lightblue", "lightGreen");

  return (
    <>
      <Tabs variant="soft-rounded" colorScheme={selectedColor}>
        <TabList>
          <Tab _selected={{ color: selectedTextColor }}>
            <Text color={{ color: textColor }}>Sniffer</Text>
          </Tab>
          <Tab _selected={{ color: selectedTextColor }}>
            <Text color={{ color: textColor }}>Diagnostics</Text>
          </Tab>
          <Tab _selected={{ color: selectedTextColor }}>
            <Text color={{ color: textColor }}>About</Text>
          </Tab>
          <DarkModeButton></DarkModeButton>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Sniffer />
          </TabPanel>
          <TabPanel>
            <Diagnostics />
          </TabPanel>
          <TabPanel>
            <About />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default TabsNavBar;
