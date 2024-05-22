import React, { useState } from "react";
import { Button, ButtonGroup } from "@chakra-ui/react";

interface ExpandableTextProps {
  children: React.ReactNode;
}

const ExpandableText = ({ children }: ExpandableTextProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <Button
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#collapseExample"
        aria-expanded={isExpanded}
        aria-controls="collapseExample"
        onClick={toggleExpand}
        colorScheme="blue"
      >
        {isExpanded ? "Hide" : "Show"}
      </Button>
      <div
        className={`collapse ${isExpanded ? "show" : ""}`}
        id="collapseExample"
      >
        <div className="card card-body">{children}</div>
      </div>
    </div>
  );
};

export default ExpandableText;
