import React from "react";
import { Alert, Container, Row, Col, Button, Navbar, Nav, Toast  } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { Leader } from './Text';
import { ch_leave_dispo } from '../socket';
import { remove_at, reset_dispo_state, clear_errors } from '../util';
import store from '../store';
import HeaderAlert from './Alert';

function Notifications({info, ticker}) {

  return (
    <div className="notifications">
      {info.length > 0 && info.map((msg, i) =>
        <Toast
          key={`info-${i}`}
          autohide
          className="toast-style"
          delay={5000}
          onClose={() => {
            store.dispatch({ type: "info/set", data: remove_at(info, i) })
          }}
          className="toast-style">
          <Toast.Header closeButton={false}>
            <Col><strong>Info</strong></Col>
            <Col xs="auto">
              <Button
                size="sm"
                className="border-0 btn-close"
                onClick={() => {
                  store.dispatch({ type: "info/set", data: remove_at(info, i) })
                }}></Button>
            </Col>
          </Toast.Header>
          <Toast.Body>{msg}</Toast.Body>
        </Toast>)}
      {ticker.length > 0 && ticker.map((msg, i) =>
        <Toast
          key={`tick-${i}`}
          autohide
          className="toast-style"
          delay={3000}
          onClose={() => {
            store.dispatch({ type: "ticker/set", data: remove_at(ticker, i) })
          }}
          className="toast-style">
          <Toast.Body>{msg}</Toast.Body>
        </Toast>)}
    </div>
  );
}

function DispoHeader({info, success, error, ticker, dispatch}) {

  let history = useHistory();
  console.log("Ticker msgs are", ticker)
  console.log("Info msgs are", info)

  return (
    <div className="mb-4">
      <Container className="bg-primary">
        <Navbar bg="light" expand="md" className="px-3">
          <Navbar.Brand>
            <h3 className="display-5 text-muted fw-lighter w-auto">
              Disposocial
            </h3>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-Navbar-nav" />
          <Navbar.Collapse expand="md">
            <Nav>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Container>
      <Notifications ticker={ticker} info={info} />
      <Col className="mt-1 mx-auto w-75">
        {success.length > 0 && success.map((msg, i) =>
          <HeaderAlert key={`succ-${i}`} i={i} msg={msg} success={success} group="success" />)}
        {error.length > 0 && error.map((msg, i) =>
          <HeaderAlert key={`error-${i}`} i={i} msg={msg} error={error} group="error" />)}
      </Col>
    </div>
  );

}

function state_to_props({info, success, error, ticker}) {
  return {info, success, error, ticker};
}

export default connect(state_to_props)(DispoHeader);
