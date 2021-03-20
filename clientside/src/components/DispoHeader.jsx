import React from "react";

export default function DispoHeader() {

  // TODO if notification update marquee
  let updates = ["Hello World", "somebody has just joined", "Pineapple"];

  return (

    <div data-role="marquee">
      {updates.map((update, i) => 
        <div key={i}>
          {update}
        </div>)}
    </div>
  );

}
