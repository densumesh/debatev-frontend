/* eslint-disable react-hooks/exhaustive-deps */
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import React, { useState } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Search as SearchIcon } from "react-bootstrap-icons";
import { throttle, debounce } from "throttle-debounce";
import { useEffect, useRef } from "react";

export default function SearchBox(props) {
  let search = React.createRef();
  let [autocomplete, setAutocomplete] = useState([]);
  let [searchTerm, setSearchTerm] = useState("");
  let ogSearch = window.location.href.substring(
    window.location.href.lastIndexOf("/") + 1
  );

  async function getText(text) {
    let result = await fetch(
      "https://api.debatev.com/api/v1/autocomplete?q=" + text + props.getUrl()
    )
      .then((response) => response.json())
      .then((data) => {
        return data;
      });

    let array = Object.keys(result).map(function (k) {
      let str = result[k][1].toString();
      return str.replace(/(<([^>]+)>)/gi, "");
    });
    console.log(array);
    setAutocomplete(array);
  }

  let autocompleteSearchDebounced = useRef(debounce(500, getText)).current;
  let autocompleteSearchThrottled = useRef(throttle(250, getText)).current;

  useEffect(() => {
    if (searchTerm.length < 5) {
      autocompleteSearchThrottled(searchTerm);
      console.log("throttle");
    } else {
      autocompleteSearchDebounced(searchTerm);
      console.log("debounce");
    }
  }, [searchTerm]);

  return (
    <InputGroup className="mb-3" style={{ flex: 1, borderRadius: "30" }}>
      <Autocomplete
        id="search-bar"
        freeSolo
        noOptionsText="No Options"
        options={autocomplete}
        style={{ width: "100%", flex: 1 }}
        value={decodeURIComponent(ogSearch.split("&")[0])}
        renderInput={(params) => (
          <div ref={params.InputProps.ref}>
            <FormControl
              ref={search}
              placeholder="Search for a card                "
              value={decodeURIComponent(ogSearch.split("&")[0])}
              y="basic-addon2"
              style={{ borderRightWidth: 0 }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  window.location.href =
                    "/search/" +
                    encodeURIComponent(search.current?.value) +
                    props.getUrl();
                }
              }}
              {...params.inputProps}
            />
          </div>
        )}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            window.location.href =
              "/search/" + encodeURIComponent(searchTerm) + props.getUrl();
          }
        }}
        onInputChange={(_event, newValue) => {
          if (newValue.length > 0) {
            setSearchTerm(newValue);
          }
        }}
        filterOptions={(x) => x}
        onChange={(_event, value, reason) => {
          if (reason === "selectOption") {
            window.location.href = "/search/" + value;
          }
        }}
      />

      <Button
        variant="outline-primary"
        onClick={(_e) => {
          window.location.href =
            "/search/" + encodeURIComponent(searchTerm) + props.getUrl();
        }}
      >
        <SearchIcon />
      </Button>
    </InputGroup>
  );
}
