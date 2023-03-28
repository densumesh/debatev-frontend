/* eslint-disable react-hooks/exhaustive-deps */
import { Multiselect } from "multiselect-react-dropdown";
import React, { useEffect, useState } from "react";

var selectedList = [];

export function getUrl() {
  var years = "";
  var dtypes = "";
  var url = "";
  for (let item of selectedList) {
    switch (item.name) {
      case "2014":
        years += "2014,";
        break;

      case "2015":
        years += "2015,";

        break;

      case "2016":
        years += "2016,";
        break;

      case "2017":
        years += "2017,";

        break;

      case "2018":
        years += "2018,";

        break;

      case "2019":
        years += "2019,";

        break;

      case "2020":
        years += "2020,";

        break;

      case "2021":
        years += "2021,";

        break;
      case "2022":
        years += "2022,";

        break;
      case "2023":
        years += "2023,";

        break;
      case "College Policy":
        dtypes += "college,";

        break;

      case "High School LD":
        dtypes += "ld,";

        break;

      case "High School Policy":
        dtypes += "hspolicy,";

        break;

      case "OpenEv":
        dtypes += "openev,";

        break;
      case "NFA LD":
        dtypes += "collegeld,";
        break;
      default:
        break;
    }
  }
  if (years.length > 0)
    url = url + "&year=" + years.substring(0, years.length - 1);
  if (dtypes.length > 0)
    url = url + "&dtype=" + dtypes.substring(0, dtypes.length - 1);
  return url;
}

export default function Filters(props) {
  let [selectedValues, setSelectedValues] = useState([]);

  useEffect(() => {
    function years1(currElm) {
      return currElm.includes("year");
    }
    function dtypes1(currElm) {
      return currElm.includes("dtype");
    }
    let params =
      "&" +
      window.location.href
        .substring(window.location.href.lastIndexOf("/") + 1)
        ?.split("&")[1] +
      "&" +
      window.location.href
        .substring(window.location.href.lastIndexOf("/") + 1)
        ?.split("&")[2];
    if (params) {
      let selectedValues = [];
      if (params.substring(1).split("&").find(years1)?.substring(5).split(","))
        for (let year1 of params
          .substring(1)
          .split("&")
          .find(years1)
          ?.substring(5)
          .split(",")) {
          selectedValues.push({ name: year1 });
        }

      if (params.substring(1).split("&").find(dtypes1)?.substring(6).split(","))
        for (let dtype1 of params
          .substring(1)
          .split("&")
          .find(dtypes1)
          ?.substring(6)
          .split(",")) {
          if (dtype1 === "college") {
            selectedValues.push({ name: "College Policy" });
          } else if (dtype1 === "ld") {
            selectedValues.push({ name: "High School LD" });
          } else if (dtype1 === "hspolicy") {
            selectedValues.push({ name: "High School Policy" });
          } else if (dtype1 === "openev") {
            selectedValues.push({ name: "OpenEv" });
          } else if (dtype1 === "collegeld") {
            selectedValues.push({ name: "NFA LD" });
          }
        }
      setSelectedValues(selectedValues);
    }
  }, []);

  function onSelect(selectedLists, _selectedItem) {
    selectedList = selectedLists;
  }

  function onRemove(selectedLists, _selectedItem) {
    selectedList = selectedLists;
  }

  return (
    <div
      style={{
        width: "50%",
        height: "30%",
        flex: 1,
        flexShrink: 1,
      }}
    >
      {window.innerWidth >= 760 ? (
        <Multiselect
          className="advanced"
          options={[
            { name: "2014", id: 1, group: "Year" },
            { name: "2015", id: 2, group: "Year" },
            { name: "2016", id: 3, group: "Year" },
            { name: "2017", id: 4, group: "Year" },
            { name: "2018", id: 5, group: "Year" },
            { name: "2019", id: 6, group: "Year" },
            { name: "2020", id: 7, group: "Year" },
            { name: "2021", id: 7, group: "Year" },
            { name: "2022", id: 8, group: "Year" },
            { name: "2023", id: 8, group: "Year" },
            { name: "College Policy", id: 9, group: "Data Set" },
            { name: "High School LD", id: 10, group: "Data Set" },
            { name: "High School Policy", id: 11, group: "Data Set" },
            { name: "OpenEv", id: 12, group: "Data Set" },
            { name: "NFA LD", id: 13, group: "Data Set" },
          ]}
          selectedValues={selectedValues}
          onSelect={onSelect}
          onRemove={onRemove}
          displayValue="name"
          groupBy="group"
          showCheckbox={true}
          placeholder={"Advanced Filters "}
          hidePlaceholder={true}
          closeOnSelect={false}
        />
      ) : null}
    </div>
  );
}
