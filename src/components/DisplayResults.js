import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from "axios";
import { Multiselect } from "multiselect-react-dropdown";
import React, { Component } from "react";
import {
  Button, Card, Dropdown, DropdownButton, FormControl, InputGroup
} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import debateEV from "../Logo/debatevsquarefinal.svg";
import CardPreview from "./CardPreview";

if (JSON.parse(localStorage.getItem('isDark'))) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}
class DisplayResults extends Component {
  state = {
    ref: "", page: 1, cards: [], search: "", isLoading: -1, amt: "20",
    options: [
      { name: "2014", id: 1, group: "Year"},
      { name: "2015", id: 2, group: "Year" },
      { name: "2016", id: 3, group: "Year" },
      { name: "2017", id: 4, group: "Year" },
      { name: "2018", id: 5, group: "Year" },
      { name: "2019", id: 6, group: "Year" },
      { name: "2020", id: 7, group: "Year" },
      { name: "College Policy", id: 8, group: "Data Set" },
      { name: "High School LD", id: 9, group: "Data Set" },
      { name: "High School Policy", id: 10, group: "Data Set" },
      { name: "OpenEv", id: 11, group: "Data Set" },
      { name: "PF (Beta)", id: 12, group: "Data Set" }
    ],
    searchtext: "",
    total: 0,
    selectedList: null,
    url: [],
    loading: true,
    name: null,
    bannerHtml: "<p></p>",
    array: []
  };

  getUrl = () => {
    let go = false;
    let years = '';
    let url = '';
    let count = 0;
    if (this.state.a14 === true) {
      go = true;
      years = years + '2014' + ',';
      count++;
    }
    if (this.state.a15 === true) {
      go = true;
      years = years + '2015' + ',';
      count++;
    }
    if (this.state.a16 === true) {
      go = true;
      years = years + '2016' + ',';
      count++;
    }
    if (this.state.a17 === true) {
      go = true;
      years = years + '2017' + ',';
      count++;
    }
    if (this.state.a18 === true) {
      go = true;
      years = years + '2018' + ',';
      count++;
    }
    if (this.state.a19 === true) {
      go = true;
      years = years + '2019' + ',';
      count++;
    }
    if (this.state.a20 === true) {
      go = true;
      years = years + '2020' + ',';
      count++;
    }

    if (go) url = url + '&year=' + years.substring(0, years.length - 1);

    go = false;
    let dtypes = '';
    if (this.state.ld == true) {
      dtypes = dtypes + 'ld' + ',';
      go = true;
      count++;
    }

    if (this.state.hspolicy == true) {
      dtypes = dtypes + 'hspolicy' + ',';
      go = true;
      count++;
    }

    if (this.state.college == true) {
      dtypes = dtypes + 'college' + ',';
      go = true;
      count++;
    }
    if (this.state.openev == true) {
      dtypes = dtypes + 'openev' + ',';
      go = true;
      count++;
    }
    if (this.state.pf == true) {
      dtypes = dtypes + 'pf' + ',';
      go = true;
      count++;
    }

    if (go) url = url + '&dtype=' + dtypes.substring(0, dtypes.length - 1);

    if (count === 11 || count === 0) return '';
    else return url + '';
  };
  onSelect = (selectedList, selectedItem) => {
    switch (selectedItem.name){ 
      case '2014':
        this.setState({ a14: true });
        break;
    
      case '2015':
        this.setState({ a15: true });
        break;

      case '2016':
        this.setState({ a16: true });
        break;

      case '2017':
        this.setState({ a17: true });
        break;

      case '2018':
        this.setState({ a18: true });
        break;

      case '2019':
        this.setState({ a19: true });
        break;
    
      case '2020':
        this.setState({ a20: true });
        break;

      case 'College Policy':
        this.setState({ college: true });
        break;

      case 'High School LD':
        this.setState({ ld: true });
        break;

      case 'High School Policy':
        this.setState({ hspolicy: true });
        break;

      case 'OpenEv':
        this.setState({ openev: true });
        break;

      case 'PF (Beta)' :
        this.setState({ pf: true });
        break;
    
  }
  };

  onRemove = (_selectedList, selectedItem) => {
    switch (selectedItem.name){ 
      case '2014':
        this.setState({ a14: false });
        break;
    
      case '2015':
        this.setState({ a15: false });
        break;

      case '2016':
        this.setState({ a16: false });
        break;

      case '2017':
        this.setState({ a17: false });
        break;

      case '2018':
        this.setState({ a18: false });
        break;

      case '2019':
        this.setState({ a19: false });
        break;
    
      case '2020':
        this.setState({ a20: false });
        break;

      case 'College Policy':
        this.setState({ college: false });
        break;

      case 'High School LD':
        this.setState({ ld: false });
        break;

      case 'High School Policy':
        this.setState({ hspolicy: false });
        break;

      case 'OpenEv':
        this.setState({ openev: false });
        break;

      case 'PF (Beta)' :
        this.setState({ pf: false });
        break;
    }
  };

  componentDidMount = () => {
    let m = window.location.href.substring(
      window.location.href.lastIndexOf("/") + 1
    );
    console.log(m);
    this.setState({ search: m });
    this.setState({ amt: "20" })
    let url =
      "https://api.debatev.com/api/v1/search?q=" + m + "&p=" + (this.state.page - 1);

    this.getData(url).then((data) => {
      let object = data;
      let array = Object.keys(object).map(function (k) {
        return object[k];
      });
      this.setState({ total: array.slice(-1)[0] })
      array.pop()
      this.setState({ cards: array });
      this.setState({ isLoading: 0 });
    });
    function years1(currElm) {
      console.log(currElm)
      return currElm.includes("year")
    }
    function dtypes1(currElm) {
      console.log(currElm)
      return currElm.includes("dtype")
    }
    if (sessionStorage.getItem('filters') === null) {
    } else {

      var selectedValues = []
      let years = []
      if (sessionStorage.getItem('filters').substring(1).split('&').find(years1)?.substring(5).split(',')) for (let year1 of sessionStorage.getItem('filters').substring(1).split('&').find(years1)?.substring(5).split(',')) {
        years.push({ "name": year1 })
        this.onSelect(this.state.selectedList, { "name": year1 })
      }

      if (sessionStorage.getItem('filters').substring(1).split('&').find(dtypes1)?.substring(6).split(',')) for (let dtype1 of sessionStorage.getItem('filters').substring(1).split('&').find(dtypes1)?.substring(6).split(',')) {
        if (dtype1 == 'college') {
          selectedValues.push({ "name": 'College Policy' })
          this.onSelect(this.state.selectedList, { "name": 'College Policy' })
        }
        else if (dtype1 == 'ld') {
          selectedValues.push({ "name": 'High School LD' })
          this.onSelect(this.state.selectedList, { "name": 'High School LD' })
        }
        else if (dtype1 == "hspolicy") {
          selectedValues.push({ "name": 'High School Policy' })
          this.onSelect(this.state.selectedList, { "name": 'High School Policy' })
        }
        else if (dtype1 == "openev") {
          selectedValues.push({ "name": 'OpenEv' })
          this.onSelect(this.state.selectedList, { "name": 'OpenEv' })
        }
        else if (dtype1 == "pf") {
          selectedValues.push({ "name": 'PF (Beta)' })
          this.onSelect(this.state.selectedList, { "name": 'PF (Beta)' })
        }
      }
      this.setState({ selectedValues: selectedValues.concat(years) })
    }
  };

  cardamt = (amt) => {
    let url = this.state.search.split('&amt')[0];
    url += "&amt=" + amt;
    this.state.amt = amt;
    return url;
  }

  goToPage = (page) => {
    window.scrollTo(0, 0)
    let m = window.location.href.substring(
      window.location.href.lastIndexOf("/") + 1
    );

    let url = "https://api.debatev.com/api/v1/search?q=" + m + "&p=" + (page - 1) + "&amt=" + this.state.amt;

    console.log(url);
    this.getData(url).then((data) => {
      let object = data;
      let array = Object.keys(object).map(function (k) {
        return object[k];
      });
      this.setState({ total: array.slice(-1)[0] })
      array.pop()
      this.setState({ cards: array });
      this.setState({ page: page })
    });

  };

  async getData(url) {
    let data = await axios.get(url);
    console.log(data.data);
    return data.data;
  }

  getAmt = (e) => {
    window.scrollTo(0, 0)
    let m = window.location.href.substring(
      window.location.href.lastIndexOf("/") + 1
    );

    let url = "https://api.debatev.com/api/v1/search?q=" + m + "&p=" + (this.state.page - 1) + '&amt=' + e;

    console.log(url);
    this.getData(url).then((data) => {
      let object = data;
      let array = Object.keys(object).map(function (k) {
        return object[k];
      });
      this.setState({ total: array.slice(-1)[0] })
      array.pop()
      this.setState({ cards: array });
      this.setState({ amt: e })
    });
  }

  async getText(text) {
    this.setState({ searchtext: text })
    let data = await axios.get('https://api.debatev.com/api/v1/autocomplete?q=' + text).then((data) => {
      let object = data.data;
      let array = Object.keys(object).map(function (k) {
        let str = object[k][1].toString();
        return str.replace(/(<([^>]+)>)/ig, '');;
      });
      this.setState({ array: array })
    });

  }

  constructor() {
    super();
    this.search = React.createRef();
  }
  render() {
    return (
      <div className="searchcard">
        {" "}
        <Card
          style={{ height: 20, flex: 1, borderWidth: 0, alignItems: "center" }}
        >
          {" "}
        </Card>
        <Card
          style={{
            flex: 1,
            alignItems: "right",
            justifyContent: "center",
            flexGrow: true,
            borderWidth: 0,
            flexDirection: "row",
          }}
        >
          <a href="https://www.debatev.com/">
            <img
              src={debateEV}
              style={{
                height: 80,
                width: 80,
                position: "absolute",
                top: -20,
                left: 30,
              }}
            />
          </a>

          <div style={{ width: 150 }} />
          <div
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "50%",
            }}
          >
            <InputGroup
              className="mb-3"
              style={{ flex: 1, borderRadius: "30" }}
            >
              <Autocomplete
                id="search-bar"
                freeSolo
                options={this.state.array}
                style={{ width: "100%", flex: 1 }}
                renderInput={(params) => (
                  <div ref={params.InputProps.ref}>
                    <FormControl
                      ref={this.search}
                      placeholder="Search for a card                 "
                      y="basic-addon2"
                      style={{ borderRightWidth: 0 }}
                      onClose={(_event, _reason) => {
                        this.setState({ array: [] })
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter")
                          window.location.href =
                            "/search/" + this.search.current.value + this.getUrl();
                      }}
                      {...params.inputProps}
                    />
                  </div>
                )}
                onKeyPress={e => {
                  if (e.key === 'Enter')
                    window.location.href =
                      '/search/' + this.state.searchtext + this.getUrl();
                  if (this.getUrl() !== '') sessionStorage.setItem('filters', this.getUrl());

                }}
                onInputChange={(_event, newValue) => { this.getText(newValue) }}
              />

              <InputGroup.Append>
                <Button
                  variant="outline-primary"
                  onClick={(_e) => {
                    window.location.href =
                      "/search/" + this.state.searchtext + this.getUrl();
                    if (this.getUrl() !== '') sessionStorage.setItem('filters', this.getUrl());

                  }}
                >
                  <Icon.Search />
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </div>
          <div style={{ width: "40%" }} />
        </Card>
        <Card
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "right",
            flexGrow: true,
            borderWidth: 0,
            flexDirection: "row",
            marginLeft: "10%",
            marginTop: -7
          }}
        >
          {window.innerWidth >= 760 ?
            <Multiselect
              options={this.state.options}
              selectedValues={this.state.selectedValues}
              onSelect={this.onSelect}
              onRemove={this.onRemove}
              displayValue="name"
              groupBy="group"
              style={{ multiselectContainer: { width: "30%", height: "30%" } }}
              showCheckbox={true}
              placeholder={this.getUrl() !== "" ? "" : "Advanced Filters "}
              closeOnSelect={false}
            /> : null}
          <div style={{ width: "9%", color: "#32a852" }} />
          {window.innerWidth >= 760 ?
            <DropdownButton id="dropdown-basic-button" title={(this.state.page === 1 ? 1 : 1 + this.state.amt * (this.state.page - 1)) + " - " + ((this.state.amt * this.state.page > this.state.total) ? this.state.total : (this.state.amt * this.state.page)) + " of " + this.state.total}
              style={{ marginTop: -7, borderWidth: 0, position: "absolute", right: 15 }}>
              <Dropdown.Item onClick={(_e) => { this.getAmt('10') }}>10</Dropdown.Item>
              <Dropdown.Item onClick={(_e) => { this.getAmt('20') }}>20 (Default)</Dropdown.Item>
              <Dropdown.Item onClick={(_e) => { this.getAmt('30') }}>30</Dropdown.Item>
              <Dropdown.Item onClick={(_e) => { this.getAmt('40') }}>40</Dropdown.Item>
            </DropdownButton> : null}
          <div style={{ width: "5%", color: "#32a852" }} />
          <Button
            className="luckybutton"
            variant="outline-primary"
            style={{ borderWidth: 1, color: "#001040" }}
            onClick={(_e) => {
              window.location.href = "/imfeelinglucky";
            }}
          >
            {" "}
            I'm Feeling Lucky{" "}
          </Button>
        </Card>{" "}
        <Card
          style={{
            flex: 1,
            alignItems: "right",
            justifyContent: "center",
            flexGrow: true,
            borderWidth: 0,
            flexDirection: "row",
          }}
        >
          <Card style={{ flex: 1, borderWidth: 0 }} />
          <Card style={{ flexDirection: "column", flex: 15, borderWidth: 0 }}>
            {this.state.cards.map((card) => (
              <CardPreview cardData={card} />
            ))}
            {this.state.isLoading === -1 ? (
              <img className="loadinggif" style={{ width: 150, height: 150, marginLeft: "auto", marginRight: "auto" }} src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif">
              </img>
            ) : null}
            {this.state.cards.length === 0 && this.state.isLoading !== -1 ? (
              <Card style={{ borderWidth: 0 }}>No Results have been found</Card>
            ) : null}
          </Card>
          <Card style={{ flex: 1, borderWidth: 0 }} />
        </Card>
        {this.state.total >= this.state.amt ?
          <Card style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            flexGrow: true,
            borderWidth: 0,
            flexDirection: "row",
            width: '100%', height: '100%'
          }}>
            <Pagination size="lg" aria-label="Page navigation example" >
              <PaginationItem {...this.state.page === 1 ? { "disabled": true } : null}>
                <PaginationLink previous onClick={(_e) => { this.goToPage(this.state.page - 1) }} className='pagination' />
              </PaginationItem>
              <PaginationItem {...this.state.page === 1 ? { "active": true } : null}>
                <PaginationLink onClick={(_e) => { this.goToPage(1) }} className='pagination'>
                  1
                </PaginationLink>
              </PaginationItem>
              {this.state.total >= this.state.amt * 1 + 1 ?
                <PaginationItem{...this.state.page === 2 ? { "active": true } : null}>
                  <PaginationLink onClick={(_e) => { this.goToPage(2) }} className='pagination'>
                    2
                  </PaginationLink>
                </PaginationItem> : null}
              {this.state.total >= this.state.amt * 2 + 1 ?
                <PaginationItem{...this.state.page === 3 ? { "active": true } : null}>
                  <PaginationLink onClick={(_e) => { this.goToPage(3) }} className='pagination'>
                    3
                  </PaginationLink>
                </PaginationItem> : null}
              {this.state.total >= this.state.amt * 3 + 1 ?
                <PaginationItem{...this.state.page === 4 ? { "active": true } : null}>
                  <PaginationLink onClick={(_e) => { this.goToPage(4) }} className='pagination'>
                    4
                  </PaginationLink>
                </PaginationItem> : null}
              {this.state.total >= this.state.amt * 4 + 1 ?
                <PaginationItem{...this.state.page === 5 ? { "active": true } : null} >
                  <PaginationLink onClick={(_e) => { this.goToPage(5) }} className='pagination'>
                    5
                  </PaginationLink>
                </PaginationItem> : null}
              <PaginationItem {...this.state.page === 5 ? { "disabled": true } : null}>
                <PaginationLink next onClick={(_e) => { this.goToPage(this.state.page + 1) }} className='pagination' />
              </PaginationItem>

            </Pagination>
          </Card> : null}
      </div>
    );
  }
}

export default DisplayResults;
