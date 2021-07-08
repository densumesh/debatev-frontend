import React, { useState } from "react";
import { Button, Card, InputGroup } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import axios from "axios";

export default function Banner() {
  let [bannerHtml, setBannerHtml] = useState();
  let [banner, setBanner] = useState(true);
  async function getData() {
    let data = await axios.get("https://api.debatev.com/api/v1/getBanner");
    setBannerHtml(data.data);
  }
  getData();

  return (
    <>
      {window.innerWidth >= 760 && banner ? (
        <InputGroup className="mb-3" style={{ flex: 1, borderRadius: "30" }}>
          <Card
            style={{
              margin: 0,
              flexGrow: true,
              width: "100%",
              color: "blue",
              backgroundColor: "yellow",
              allignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              fontSize: 20,
              flex: 1,
            }}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: bannerHtml,
              }}
            />
          </Card>
          <InputGroup.Append>
            <Button
              variant="light"
              style={{
                backgroundColor: "yellow",
              }}
              onClick={(_e) => {
                setBanner(false);
              }}
            >
              <Icon.X />
            </Button>
          </InputGroup.Append>
        </InputGroup>
      ) : null}
    </>
  );
}
