/* eslint-disable react-hooks/exhaustive-deps */
import { Multiselect } from "multiselect-react-dropdown";
import React, { useEffect, useState } from "react";

export default function Filters(props) {
  let [years, setYears] = useState({
    a14: false,
    a15: false,
    a16: false,
    a17: false,
    a18: false,
    a19: false,
    a20: false,
    a21: false,
  });

  let [dtype, setDtype] = useState({
    college: false,
    hspolicy: false,
    ld: false,
    openev: false,
  });

  let [selectedValues] = useState(props.selectedValues);

  useEffect(() => props.stateChanger(years, dtype), [years, dtype]);

  useEffect(() => {
    if (props.selectedValues !== null) {
      for (let i = 0; i < props.selectedValues?.length; i++) {
        onSelect(props.selectedValues, props.selectedValues[i]);
      }
    }
  }, []);

  function onSelect(_selectedList, selectedItem) {
    switch (selectedItem.name) {
      case "2014":
        setYears({ ...years, a14: true });
        break;

      case "2015":
        setYears({ ...years, a15: true });

        break;

      case "2016":
        setYears({ ...years, a16: true });
        break;

      case "2017":
        setYears({ ...years, a17: true });

        break;

      case "2018":
        setYears({ ...years, a18: true });

        break;

      case "2019":
        setYears({ ...years, a19: true });

        break;

      case "2020":
        setYears({ ...years, a20: true });

        break;

      case "2021":
        setYears({ ...years, a21: true });

        break;
      case "College Policy":
        setDtype({ ...dtype, college: true });

        break;

      case "High School LD":
        setDtype({ ...dtype, ld: true });

        break;

      case "High School Policy":
        setDtype({ ...dtype, hspolicy: true });

        break;

      case "OpenEv":
        setDtype({ ...dtype, openev: true });

        break;

      default:
        break;
    }
  }

  function onRemove(_selectedList, selectedItem) {
    switch (selectedItem.name) {
      case "2014":
        setYears({ ...years, a14: false });

        break;

      case "2015":
        setYears({ ...years, a15: false });

        break;

      case "2016":
        setYears({ ...years, a16: false });

        break;

      case "2017":
        setYears({ ...years, a17: false });

        break;

      case "2018":
        setYears({ ...years, a18: false });

        break;

      case "2019":
        setYears({ ...years, a19: false });

        break;

      case "2020":
        setYears({ ...years, a20: false });

        break;
      case "2021":
        setYears({ ...years, a21: false });

        break;
      case "College Policy":
        setDtype({ ...dtype, college: false });

        break;

      case "High School LD":
        setDtype({ ...dtype, ld: false });

        break;

      case "High School Policy":
        setDtype({ ...dtype, hspolicy: false });

        break;

      case "OpenEv":
        setDtype({ ...dtype, openev: false });

        break;

      default:
        break;
    }
  }

  return (
    <>
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
            { name: "College Policy", id: 8, group: "Data Set" },
            { name: "High School LD", id: 9, group: "Data Set" },
            { name: "High School Policy", id: 10, group: "Data Set" },
            { name: "OpenEv", id: 11, group: "Data Set" },
          ]}
          selectedValues={selectedValues}
          onSelect={onSelect}
          onRemove={onRemove}
          displayValue="name"
          groupBy="group"
          style={{
            multiselectContainer: {
              width: "50%",
              height: "30%",
              flex: 1,
            },
            flexShrink: 1,
          }}
          showCheckbox={true}
          placeholder={"Advanced Filters "}
          hidePlaceholder={
            (!Object.keys(years).every((k) => !years[k]) &&
              !Object.keys(dtype).every((k) => !dtype[k])) ||
            selectedValues?.length !== 0
          }
          closeOnSelect={false}
        />
      ) : null}
    </>
  );
}
