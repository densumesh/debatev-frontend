import Button from "react-bootstrap/Button";
import React, { useState } from "react";

export default function UploadCard(props) {
  const inputFileRef = React.useRef();
  const [isLoading, setLoading] = useState(false);
  const [text, setText] = useState("Upload Cards");
  const onFileChangeCapture = (e) => {
    /*Selected files data can be collected here.*/
    setLoading(true);
    var formdata = new FormData();
    formdata.append("file", e.target.files[0], e.target.files[0].name);

    var requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    fetch("https://api.debatev.com/api/v1/uploadCase", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .then((result) => setLoading(false))
      .then((result) => setText("Uploaded!"))
      .then((result) => setTimeout(() => setText("Upload Cards"), 3000))
      .catch((error) => console.log("error", error));
  };
  const onBtnClick = () => {
    /*Collecting node-element and performing click*/
    inputFileRef.current.click();
  };

  return (
    <>
      {window.innerWidth >= 760 ? (
        <div className="custom-file-label custom custom-file">
          <input
            type="file"
            id="inputGroupFile01"
            className="custom-file-input"
            ref={inputFileRef}
            onChangeCapture={onFileChangeCapture}
            style={{ position: "fixed", top: "-100em" }}
            accept=".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf"
          />
          <label htmlFor="inputGroupFile01" className="custom-file-label">
            <Button
              style={{
                backgroundColor: "#1C86EE",
                marginTop: "5px",
                color: "#FFF",
                borderWidth: 0,
                position: "absolute",
                top: 5,
                left: 10,
                marginRight: 10,
              }}
              onClick={!isLoading ? onBtnClick : null}
            >
              {text}
            </Button>
          </label>
        </div>
      ) : null}
    </>
  );
}
