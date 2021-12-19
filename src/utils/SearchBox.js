import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import React, { useState } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Search as SearchIcon } from "react-bootstrap-icons";

export default function SearchBox(props) {
  let search = React.createRef();
  let [autocomplete, setAutocomplete] = useState([]);
  let [searchTerm, setSearchTerm] = useState("");

  async function getText(text) {
    setSearchTerm(text);

    let promise = await fetch(
      "https://api.debatev.com/api/v1/autocomplete?q=" + text + props.getUrl()
    )
      .then((response) => response.json())
      .then((data) => {
        return data;
      });

    const localPromise = promise;
    const result = await promise;

    if (promise === localPromise) {
      let array = Object.keys(result).map(function (k) {
        let str = result[k][1].toString();
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
        value={
          window.location.href !== window.location.origin + "/"
            ? sessionStorage.getItem("searchTerm")
            : sessionStorage.setItem("searchTerm", "")
        }
        renderInput={(params) => (
          <div ref={params.InputProps.ref}>
            <FormControl
              ref={search}
              placeholder="Search for a card                "
              value={sessionStorage.getItem("searchTerm")}
              y="basic-addon2"
              style={{ borderRightWidth: 0 }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  window.location.href =
                    "/search/" + search.current?.value + props.getUrl();
                  sessionStorage.setItem("filters", props.getUrl());
                  sessionStorage.setItem("searchTerm", search.current?.value);
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
            sessionStorage.setItem("searchTerm", searchTerm);
          }
        }}
        onInputChange={(_event, newValue) => {
          if (newValue.length > 0) getText(newValue);
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
          <SearchIcon />
        </Button>
      </InputGroup.Append>
    </InputGroup>
  );
}
