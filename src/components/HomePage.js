import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from 'axios';
import debounce from 'debounce';
import { Multiselect } from 'multiselect-react-dropdown';
import React, { Component } from 'react';
import {
  Button, Card, FormControl, InputGroup
} from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import debateEV2 from '../Logo/debatevlargefinal.svg';

class HomePage extends Component {
  state = {
    options: [
      { name: '2014', id: 1, group: 'Year' },
      { name: '2015', id: 2, group: 'Year' },
      { name: '2016', id: 3, group: 'Year' },
      { name: '2017', id: 4, group: 'Year' },
      { name: '2018', id: 5, group: 'Year' },
      { name: '2019', id: 6, group: 'Year' },
      { name: '2020', id: 7, group: 'Year' },
      { name: 'College Policy', id: 8, group: 'Data Set' },
      { name: 'High School LD', id: 9, group: 'Data Set' },
      { name: 'High School Policy', id: 10, group: 'Data Set' },
      { name: 'OpenEv', id: 11, group: 'Data Set' },
      { name: 'PF (Beta)', id: 12, group: 'Data Set' }
    ],
    Buttontext: JSON.parse(localStorage.getItem('isDark')) ? 'Light Theme' : 'Dark Theme',
    searchtext: "",
    selectedList: null,
    selectedValues: [],
    a14: false,
    a15: false,
    a16: false,
    a17: false,
    a18: false,
    a19: false,
    a20: false,
    hspolicy: false,
    ld: false,
    college: false,
    openev: false,
    pf: false,
    banner: true,
    name: null,
    bannerHtml: '<p></p>',
    array: []
  };

  DarkToggle = event => {
    const DARK_CLASS = 'dark';
    window.localStorage.setItem('isDark', JSON.stringify(event));
    if (JSON.parse(window.localStorage.getItem('isDark'))) {
      document.documentElement.classList.add(DARK_CLASS);
    } else {
      document.documentElement.classList.remove(DARK_CLASS);
    }
  };
  ButtonTextChange = () => {
    if (JSON.parse(localStorage.getItem('isDark'))) {
      this.setState({ Buttontext: 'Light Theme' });
    } else {
      this.setState({ Buttontext: 'Dark Theme' });
    }
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
  constructor() {
    super();
    this.search = React.createRef();
    this.getText = this.getText.bind(this)
  }
  componentDidUpdate = () => { };

  componentDidMount = () => {
    if (JSON.parse(localStorage.getItem('isDark')) === undefined) {
      localStorage.setItem('isDark', 'false');
    }
    if (JSON.parse(localStorage.getItem('isDark'))) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
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
      if (sessionStorage.getItem('filters').substring(1).split('&').find(years1)?.substring(5).split(',')) for (let year1 of sessionStorage.getItem('filters').substring(1).split('&').find(years1) ?.substring(5).split(',')) {
        years.push({ "name": year1 })
        this.onSelect(this.state.selectedList, { "name": year1 })
      }

      if (sessionStorage.getItem('filters').substring(1).split('&').find(dtypes1)?.substring(6).split(',')) for (let dtype1 of sessionStorage.getItem('filters').substring(1).split('&').find(dtypes1) ?.substring(6).split(',')) {
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
    this.getData('https://api.debatev.com/api/v1/getBanner');
  };

  async getData(url) {
    let data = await axios.get(url);
    this.setState({ bannerHtml: data });
  }

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

  async getText(text) {
    this.setState({ searchtext: text })

    this.promise = await axios.get('https://api.debatev.com/api/v1/autocomplete?q=' + text + this.getUrl())

    const localPromise = this.promise;
    const result = await this.promise;

    if (this.promise === localPromise) {
      let object = result.data;
      let array = Object.keys(object).map(function(k) {
        let str = object[k][1].toString();
        return str.replace(/(<([^>]+)>)/ig, '');
      })
      this.setState({ array: array })
    }
  }

  render() {
    return (
      <div>
        <Card
          style={{
            height: 300,
            borderWidth: 0,
            alignItems: 'center'
          }}
        >
          {window.innerWidth >= 760 && this.state.banner ? (<InputGroup
            className="mb-3"
            style={{ flex: 1, borderRadius: '30' }}>
            <Card
              style={{
                margin: 0,
                flexGrow: true,
                width: '100%',
                color: 'blue',
                backgroundColor: 'yellow',
                allignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                fontSize: 20,
                flex: 1
              }}

            >

              <div
                dangerouslySetInnerHTML={{
                  __html: this.state.bannerHtml.data
                }}
              />
            </Card>
            <InputGroup.Append>
              <Button
                variant="light"
                style={{
                  backgroundColor: 'yellow'
                }}
                onClick={e => {
                  this.setState({ banner: false })
                }}
              >
                <Icon.X />
              </Button>
            </InputGroup.Append>
          </InputGroup>) : null}
          <Card
            style={{
              height: 0,
              borderWidth: 0,
              alignItems: 'center'
            }}
          />{' '}
          <InputGroup>
            <Button
              style={{
                backgroundColor: '#1C86EE',
                color: '#FFF',
                borderWidth: 0,
                position: "absolute",
                top: 5,
                right: 130,
                marginRight: 10
              }}
              onClick={e => {
                window.location.href = "/saved"
              }}
            >
              Saved Cards
            </Button>
            <InputGroup.Append>
            <Button
              style={{
                backgroundColor: '#1C86EE',
                color: '#FFF',
                borderWidth: 0,
                position: "absolute",
                top: 5,
                right: "1%"
              }}
              onClick={e => {
                this.DarkToggle(!JSON.parse(localStorage.getItem('isDark')));
                this.ButtonTextChange();
              }}
            >
              {this.state.Buttontext}
            </Button>
            </InputGroup.Append>
          </InputGroup>
            
      
          {window.innerWidth >= 760 ? (
            <img
              src={debateEV2}
              style={{
                
                height: 300,
                width: 500
              }}
            />
          ) : (
              <img
                src={debateEV2}
                style={{
                  height: 200,
                  width: 300
                }}
              />
            )}

          <Card
            style={{
              height: 25,

              borderWidth: 0,
              alignItems: 'center'
            }}
          />
        </Card>
        <Card
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: true,
            borderWidth: 0
          }}
        >
          <div style={{ width: '25%' }} />
          <div
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '50%'
            }}
          >
            <InputGroup
              className="mb-3"
              style={{ flex: 1, borderRadius: '30' }}
            >
              <Autocomplete
                id="search-bar"
                freeSolo
                noOptionsText="No Options"
                options={this.state.array}
                style={{ width: "100%", flex: 1 }}
                renderInput={(params) => (
                  <div ref={params.InputProps.ref}>
                    <FormControl
                      ref={this.search}
                      placeholder="Search for a card                "
                      y="basic-addon2"
                      style={{ borderRightWidth: 0 }}

                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          window.location.href =
                            "/search/" + this.search.current.value + this.getUrl();
                          sessionStorage.setItem('filters', this.getUrl());
                        }
                      }}
                      {...params.inputProps}
                    />
                  </div>
                )}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    window.location.href =
                      '/search/' + this.state.searchtext + this.getUrl();
                    if (this.getUrl() !== '') sessionStorage.setItem('filters', this.getUrl());
                  }
                }}
                onInputChange={(event, newValue) => { debounce(this.getText(newValue), 500) }}
              />

              <InputGroup.Append>
                <Button
                  variant="outline-primary"
                  onClick={e => {
                    window.location.href =
                      '/search/' + this.state.searchtext + this.getUrl();
                    if (this.getUrl() !== '') sessionStorage.setItem('filters', this.getUrl());
                  }}
                >
                  <Icon.Search />
                </Button>
              </InputGroup.Append>
            </InputGroup>
            <div style={{ width: '9%', color: '#32a852' }} />
            {window.innerWidth <= 760 ? (
              <Button
                className="luckybutton"
                variant="outline-primary"
                style={{ borderWidth: 1, color: '#001040' }}
                onClick={e => {
                  window.location.href = '/imfeelinglucky';
                }}
              >
                {' '}
                I'm Feeling Lucky{' '}
              </Button>
            ) : null}
          </div>
          <div style={{ width: '25%' }} />
        </Card>
        <Card
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: true,
            borderWidth: 0,
            flexDirection: 'row'
          }}
        >
          {window.innerWidth >= 760 ? (
            <Multiselect
              className="advanced"
              options={this.state.options}
              selectedValues={this.state.selectedValues}
              onSelect={this.onSelect}
              onRemove={this.onRemove}
              displayValue="name"
              groupBy="group"
              style={{ multiselectContainer: { width: '30%', height: '30%' } }}
              showCheckbox={true}
              placeholder={this.getUrl() !== '' ? '' : 'Advanced Filters '}
              closeOnSelect={false}
            />
          ) : null}
          <div style={{ width: '9%', color: '#32a852' }} />
          {window.innerWidth >= 760 ? (
            <Button
              variant="outline-primary"
              className="luckybutton"
              style={{ borderWidth: 1, color: '#001040' }}
              onClick={e => {
                window.location.href = '/imfeelinglucky';
              }}
            >
              {' '}
              I'm Feeling Lucky{' '}
            </Button>
          ) : null}
        </Card>{' '}
        <div style={{
         position: "absolute",
         bottom: 10,
         textAlign: "center",
          width: "100%"
        }}>
        <a href="https://github.com/densumesh/debatev-frontend">Debate Evidence</a> | Dens Sumesh, Akaash Kolluri, Rohan Agrawal
        </div>
        
        </div>
    );
  }
}

export default HomePage;
