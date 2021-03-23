import React from "react";
import { Alert } from "react-bootstrap";

export default function DispoHeader() {

  // TODO if notification update marquee
  let updates = ["Hello World", "somebody has just joined", "Pineapple"];

  return (
    <Alert variant="info">
      <div data-role="marquee">
        {updates.map((update, i) =>
          <div key={i}>
            {update}
          </div>)}
        </div>
      </Alert>
    );

  }
