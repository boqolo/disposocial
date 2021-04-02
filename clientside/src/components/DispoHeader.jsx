import React from "react";
import { Alert, Container, Row, Col, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { Leader } from './Text';
import { ch_leave_dispo } from '../socket';
import { remove_at } from '../util';
import HeaderAlert from './Alert';

function DispoHeader({info, success, error, dispatch}) {

  // TODO if notification update marquee
  let updates = ["Hello World", "somebody has just joined", "Pineapple"];
  let history = useHistory();

  function handle_leave() {
    ch_leave_dispo();
    history.replace("/");

  }

  let remove_msg = (i, variant) =>
    <Button
      size="sm"
      variant={`outline-${variant}`}
      className="text-decoration-none"
      onClick={() => {
        console.log("REmoving")
        dispatch({ type: "success/set", data: remove_at(success, i) })
      }}>
      {"X"}
    </Button>;

  return (
    <div>
      <Row className="m-0 p-0">
        <Col xs="auto" className="d-flex p-0 flex-row align-items-center">
          <h3 className="text-muted fw-lighter w-auto">{"Disposocial (info)"}</h3>
        </Col>
        <Col className="p-0 mx-4">
          <Container className="bg-primary h-100">
            <Container className="bg-light px-0 py-3 h-100 w-100">
              <div
                id="ticker"
                data-role="marquee">
                {info.map((msg, i) =>
                  <div key={`info-${i}`}>
                    {msg}
                  </div>)}
                </div>
              </Container>
            </Container>
        </Col>
        <Col xs="auto" className="p-0">
          <h5>{"logout stuff here"}</h5>
          <Button
            onClick={handle_leave}
            variant="danger">
            {"Leave"}
          </Button>
        </Col>
      </Row>
      <Col className="mt-3 mx-auto w-75">
        {success.length > 0 && success.map((msg, i) =>
          <HeaderAlert key={`succ-${i}`} i={i} msg={msg} success={success} group="success" />)}
        {error.length > 0 && error.map((msg, i) =>
          <HeaderAlert key={`error-${i}`} i={i} msg={msg} error={error} group="error" />)}
      </Col>
    </div>
  );

}

function state_to_props({info, success, error}) {
  return {info, success, error};
}

export default connect(state_to_props)(DispoHeader);
