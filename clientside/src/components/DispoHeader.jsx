import React from "react";
import { Alert, Container } from "react-bootstrap";
import { Leader } from './Text';

export default function DispoHeader() {

  // TODO if notification update marquee
  let updates = ["Hello World", "somebody has just joined", "Pineapple"];

  return (
    <div>
      <Container className="d-flex flex-row align-items-center">
        <h3 className="text-muted fw-lighter">{"Disposocial (info)"}</h3>
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
      </Container>
      </div>
    );

  }
