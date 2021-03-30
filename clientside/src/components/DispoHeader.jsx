import React from "react";
import { Alert, Container, Row, Col } from "react-bootstrap";
import { Leader } from './Text';
import { ch_leave_dispo } from '../socket';

export default function DispoHeader() {

  // TODO if notification update marquee
  let updates = ["Hello World", "somebody has just joined", "Pineapple"];

  return (
    <div>
      <Row className="m-0 p-0">
        <Col xs="auto" className="d-flex p-0 flex-row align-items-center">
          <h3 className="text-muted fw-lighter w-auto">{"Disposocial (info)"}</h3>
        </Col>
        <Col className="p-0">
          <Container className="w-50 bg-primary">
            <Container className="bg-light px-0 py-3 h-100">
              <div
                id="ticker"
                data-role="marquee">
                {updates.map((update, i) =>
                  <div key={i}>
                    {update}
                  </div>)}
                </div>
              </Container>
            </Container>
        </Col>
        <Col xs="auto" className="p-0">
          <h5>{"logout stuff here"}</h5>
        </Col>
      </Row>
    </div>
  );

}
