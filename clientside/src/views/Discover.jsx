import React from 'react';
import PageHeader from '../components/PageHeader.jsx';

export default function Discover() {

  function getMyLocation() {
    let geo = navigator.geolocation;
    let opts = {
      enableHighAccuracy: true,
      timeout: 7000 // time after which it will error if info not received
    };

    // this handler can be registered when the position is
    // retrieved and have access to do things with the coords
    let success = (geoPosn) => {
      // TODO dispatch location to store here
      let crd = geoPosn.coords;
      // crd.latitude, crd.longitude, crd.accuracy
      // TODO use coords to check if in range of an existing social radius
    };

    let error = (err) => {
      // TODO dispatch error to show user
    };

    // Locate me
    // geo.getCurrentPosition(success, (err) => err, opts);
    let watcher_id = geo.watchPosition(success, error, opts)
    return {geo, watcher_id};
  }

  React.useEffect(() => {
    // get my location on mount, unwatch on unmount
    // TODO dispatch watcher_id to store,

    return function cleanup() {
      // FIXME geo.clearWatch(watcher_id);
    };
  }, []);

  return (
    <div>
      <PageHeader />
      <h1>{"TODO: use location to find local dispos and list them"}</h1>
    </div>
  );

}
