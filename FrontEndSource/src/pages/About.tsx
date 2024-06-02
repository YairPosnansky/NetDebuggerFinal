import React, { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import axios from "axios";

const About = () => {
  const [pdfData, setPdfData] = useState(null);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await axios.get("/pdf", {
          responseType: "arraybuffer",
        });
        setPdfData(response.data);
      } catch (error) {
        console.error("Error fetching PDF:", error);
      }
    };

    fetchPdf();
  }, []);

  return (
    <div>
      <h1>About</h1>
      {pdfData && (
        <Document file={{ data: pdfData }}>
          <Page pageNumber={1} />
        </Document>
      )}
    </div>
  );
};

export default About;
