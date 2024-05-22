import { ReactNode } from "react";

interface props {
  children: ReactNode;
  show: Boolean;
  onClickClose: (click: boolean) => void;
}

const Alert = ({ children, show, onClickClose }: props) => {
  var showT: String = "";
  show == true ? (showT = "show") : (showT = "");
  return (
    <div
      className={"alert alert-warning alert-dismissible fade" + showT}
      role="alert"
    >
      {children}
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        onClick={() => {
          onClickClose(false);
        }}
      ></button>
    </div>
  );
};

export default Alert;
