import React from "react";
import { Alert, Container, Row, Col, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { Leader } from './Text';
import { ch_leave_dispo } from '../socket';
import { remove_at, reset_dispo_state, clear_errors } from '../util';
import HeaderAlert from './Alert';

function DispoHeader({info, success, error, ticker, dispatch}) {

  // TODO if notification update marquee
  let history = useHistory();
  console.log("Ticker msgs are", ticker)
  console.log("Info msgs are", info)

  function handle_leave() {
    ch_leave_dispo();
    clear_errors(dispatch);
    reset_dispo_state(dispatch);
    dispatch({ type: "success/one", data: "Left Dispo" });
    history.replace("/");
  }

  function Timer({dispo_timer, dispatch}) {
    return (
      <div>
        <span className="display-3">{dispo_timer}</span>
      </div>
    );
  }

  let Countdown = connect(({dispo_timer}) => {
    return {dispo_timer}
  })(Timer);

  return (
    <div>
      <Row className="m-0 p-0">
        <Col xs="auto" className="d-flex p-0 flex-row align-items-center">
          <h3 className="display-5 text-muted fw-lighter w-auto">
            Disposocial
          </h3>
        </Col>
        <Col className="p-0 mx-4">
          <Container className="bg-primary h-100">
            <Container className="bg-light px-0 py-3 h-100 w-100">
              <div
                id="ticker"
                data-role="marquee">
                {ticker.map((msg, i) =>
                  <div key={`tick-${i}`}>
                    {msg}
                  </div>)}
                </div>
              </Container>
            </Container>
        </Col>
        <Col className="p0" xs="auto">
        </Col>
        <Col xs="auto" className="p-0 d-flex align-items-center">
          <Button
            size="lg"
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

function state_to_props({info, success, error, ticker}) {
  return {info, success, error, ticker};
}

export default connect(state_to_props)(DispoHeader);
