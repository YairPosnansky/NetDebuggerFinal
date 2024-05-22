import { useState } from "react";
import styled from "styled-components";
const List = styled.ul`
  list-style: none;
  padding: 0;
`;
interface Props {
  items: string[];
  heading: string;

  onSelectItem: (item: string) => void;
}

function ListGroup({ items, heading, onSelectItem }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const msg = items.length === 0 && <h1>nahhh</h1>;
  return (
    <>
      <h1>{heading}</h1>
      {msg}
      <List className="list-group">
        {items.map((item, index) => (
          <li
            className={
              index === selectedIndex
                ? "list-group-item active"
                : "list-group-item"
            }
            key={item}
            onClick={() => {
              setSelectedIndex(index);
              onSelectItem(item);
            }}
          >
            {item}
          </li>
        ))}
      </List>
    </>
  );
}

export default ListGroup;
