import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import styled from "styled-components";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
