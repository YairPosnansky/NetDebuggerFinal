import { ReactNode, useState } from "react";

interface props {
  children: ReactNode;
  color: string;
  onClickButton: (count: number) => void;
}

const Button = ({ children, color, onClickButton }: props) => {
  const [clickCounter, setClickedCounter] = useState(0);
  const prefix = "btn btn-";
  return (
    <button
      type="button"
      className={prefix + color}
      onClick={() => {
        setClickedCounter(clickCounter + 1);
        onClickButton(clickCounter);
      }}
    >
      {children}
    </button>
  );
};

export default Button;
