import React, { Component } from "react";
import {
  Modal,
  Button,
  Card,
  DropdownButton,
  Dropdown
} from "react-bootstrap";

class CardPreview extends Component {
  state = { visible: false, cardName: "", saved: false };
  openModal = () => {
    this.setState({ visible: true });
    let location = window.location.href.substring(window.location.href.lastIndexOf("/") + 1);
    let destination = location === "imfeelinglucky" || location === "saved" ? location : this.props.cardData[0]
    this.props.history.push(destination)
  };
  closeModal = () => {
    this.setState({ visible: false });
    this.props.history.goBack()
  };
  componentDidMount = () => {
    let x = this.props.cardData[1].filepath;
    x = x.substring(x.lastIndexOf("/") + 1);
    x = x.replaceAll("%20", " ");
    x = x.replaceAll("-", " ");
    x = x.substring(0, x.lastIndexOf("doc") - 1);
    this.setState({ cardName: x });
    this.setState({saved: localStorage.getItem('saved')?.split(',').includes(this.props.cardData[0])})
    console.log(this.props.cardData[2])
    if (this.props.cardData[2].replace('dtype: ', '') === 'college') {
      this.setState({dtype: "College Policy"})
    }
    else if (this.props.cardData[2].replace('dtype: ', '') === 'ld') {
      this.setState({dtype: "High School LD"})
    }
    else if (this.props.cardData[2].replace('dtype: ', '') === "hspolicy") {
      this.setState({dtype: "High School Policy"})
    }
    else if (this.props.cardData[2].replace('dtype: ', '') === "openev") {
      this.setState({dtype: "OpenEv"})
    }
    else if (this.props.cardData[2].replace('dtype: ', '') === "pf") {
      this.setState({dtype: "PF"})
    }
  };


  unsaveCard = (cardID) => {
    this.setState({saved: false})
    let saved = []
    if (localStorage.getItem('saved')){
      saved = localStorage.getItem('saved').split(',')
      let foundIndex = saved.indexOf(cardID)
      saved.pop(foundIndex)
    }
    
    if (window.location.href === window.location.origin + '/saved'){
      window.location.reload()
    }
    localStorage.setItem('saved', saved)
  }
  saveCard = (cardID) => {
    this.setState({saved: true})
    let saved = []
    if (localStorage.getItem('saved')){
      saved.push(localStorage.getItem('saved'))
      saved.push(cardID)
    } else {
      saved.push(cardID)
    }

    localStorage.setItem('saved', saved)
  }

  render() {
    return (
      <div>
        <Card  className = "cardhtml" style={{ borderWidth: 0 }}>
          <div
            style={{
                maxHeight: 297,
              }}
            dangerouslySetInnerHTML={{
              __html: this.props.cardData[1].cardHtml,
            }}
            onClick={() =>
              this.openModal()
            }
          />
        </Card>
        <Button onClick={this.openModal}>Open this card</Button>
        <Card style={{ height: 100, borderWidth: 0 }} />

        <Modal
          scrollable={true}
          show={this.state.visible}
          onHide={this.closeModal}
          size="lg"
        >
          <Modal.Header>
            <Modal.Title id="example-modal-sizes-title-sm" style={{ flex: 1 }}>
              <Button
              className="filename"
                style={{
                  height: "30",
                  backgroundColor: "#FFF",
                  color: "#000",
                  borderWidth: 0,
                  position: "absolute",
                  left: 0,
                  fontSize: 18
                }}
                onClick={() => {
                  window.location.href = this.props.cardData[1].filepath;
                }}
              >
                {this.state.cardName}
              </Button>
              {""}
            </Modal.Title>
            <DropdownButton id="dropdown-basic-button" title="More Info"           
              onMouseEnter = {() => this.setState({open: true}) }
              onMouseLeave = {() => this.setState({open: false})}
              show={this.state.open}>
              <Dropdown.Item>{"Year: " + this.props.cardData[1].year}</Dropdown.Item>
              <Dropdown.Item>{"From: " + this.state.dtype}</Dropdown.Item>
            </DropdownButton>
          </Modal.Header>
          <Modal.Body>
            <div
              dangerouslySetInnerHTML={{
                __html: this.props.cardData[1].cardHtml,
              }}
            />
          </Modal.Body>

          <Modal.Footer style={{ flex: 1 }}>
            <Button
              style={{
                backgroundColor: "#1C86EE",
                color: "#FFF",
                borderWidth: 0,
                position: "absolute",
                left: 5,
              }}
              onClick={() => {
                window.location.href = "https://api.debatev.com/api/v1/download?q=" + this.props.cardData[0]
              }}
            >
              Download
            </Button>
            {this.state.saved ? <Button
              variant="danger"
              style={{
                borderWidth: 0,
                width : '100px'
              }}
              onClick={() => {
                this.unsaveCard(this.props.cardData[0])
                }
              }
            >
              Unsave
            </Button>:
            <Button
              style={{
                backgroundColor: "#1C86EE",
                color: "#FFF",
                borderWidth: 0,
                width : '100px'
              }}
              onClick={() => {
                this.saveCard(this.props.cardData[0])
                }
              }
            >
              Save
            </Button>}
            <Button variant="danger" style={{width : '100px'}} onClick={this.closeModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default CardPreview;
