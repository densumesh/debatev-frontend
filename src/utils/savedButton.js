import { Button } from "react-bootstrap";

export default function SavedButton() {
  return (
    <Button
      style={{
        backgroundColor: "#1C86EE",
        color: "#FFF",
        borderWidth: 0,
        position: "absolute",
        top: 5,
        right: 130,
        marginRight: 10,
      }}
      onClick={(_e) => {
        window.location.href = "/saved";
      }}
    >
      Saved Cards
    </Button>
  );
}
