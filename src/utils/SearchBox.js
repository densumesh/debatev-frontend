import { Button, FormControl, InputGroup } from "react-bootstrap";
import React, { useState } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import * as Icon from "react-bootstrap-icons";
import axios from "axios";

export default function SearchBox(props) {
  let search = React.createRef();
  let [autocomplete, setAutocomplete] = useState([]);
  let [searchTerm, setSearchTerm] = useState("");

  async function getText(text) {
    setSearchTerm(text);

    let promise = await axios.get(
      "https://api.debatev.com/api/v1/autocomplete?q=" + text + props.getUrl()
    );

    const localPromise = promise;
    const result = await promise;

    if (promise === localPromise) {
      let object = result.data;
      let array = Object.keys(object).map(function (k) {
        let str = object[k][1].toString();
        return str.replace(/(<([^>]+)>)/gi, "");
      });
      setAutocomplete(array);
    }
  }

  return (
    <InputGroup className="mb-3" style={{ flex: 1, borderRadius: "30" }}>
      <Autocomplete
        id="search-bar"
        freeSolo
        noOptionsText="No Options"
        options={autocomplete}
        style={{ width: "100%", flex: 1 }}
        renderInput={(params) => (
          <div ref={params.InputProps.ref}>
            <FormControl
              ref={search}
              placeholder="Search for a card                "
              y="basic-addon2"
              style={{ borderRightWidth: 0 }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  window.location.href =
                    "/search/" + search.current.value + props.getUrl();
                  sessionStorage.setItem("filters", props.getUrl());
                }
              }}
              {...params.inputProps}
            />
          </div>
        )}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            window.location.href = "/search/" + searchTerm + props.getUrl();
            sessionStorage.setItem("filters", props.getUrl());
          }
        }}
        onInputChange={(_event, newValue) => {
          getText(newValue);
        }}
      />

      <InputGroup.Append>
        <Button
          variant="outline-primary"
          onClick={(_e) => {
            window.location.href = "/search/" + searchTerm + props.getUrl();
            sessionStorage.setItem("filters", props.getUrl());
          }}
        >
          <Icon.Search />
        </Button>
      </InputGroup.Append>
    </InputGroup>
  );
}
