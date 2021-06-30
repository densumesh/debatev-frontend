import React, { Component } from "react";
import {
  Modal,
  Button,
  Card
} from "react-bootstrap";


class CardPreview extends Component {
  state = { visible: false, cardName: "", saved: false };
  openModal = () => {
    this.setState({ visible: true });
  };
  closeModal = () => {
    this.setState({ visible: false });
  };
  componentDidMount = () => {
    let x = this.props.cardData[1].filepath;
    x = x.substring(x.lastIndexOf("/") + 1);
    x = x.replaceAll("%20", " ");
    x = x.replaceAll("-", " ");
    x = x.substring(0, x.lastIndexOf("doc") - 1);
    this.setState({ cardName: x });
    this.setState({saved: localStorage.getItem('saved')?.split(',').includes(this.props.cardData[0])})
  };

  parseHtml = (htm) => {
    return htm;
  };
 
  copyLink = () => {
    let link = 'https://www.debatev.com/search/' + this.props.cardData[0];
    navigator.clipboard.writeText(link);
  }

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
              __html: this.parseHtml(this.props.cardData[1].cardHtml),
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
            <Button className="copyButton" variant="primary" onClick={() => {this.copyLink()}}>Copy Link</Button>
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
