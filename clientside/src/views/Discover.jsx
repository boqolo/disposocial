import React from 'react';
import PageHeader from '../components/PageHeader';
import { Leader } from '../components/Text';
import { Col, Row, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import store from '../store';
import { api_fetch_local_dispos } from '../api';
import { convertDateTime } from '../util';

function None({session}) {

  console.log("session is", session)

  return (
    <div>
      <h2>{"None found in your location"}</h2>
      {session?.user_id &&
        <div className="my-5">
          <Link to="/dispo/create">
            <Button variant="primary" size="lg">{"Create one"}</Button>
          </Link>
      </div>}
    </div>
  );
}

function Discover({session, location, local_dispos, dispatch}) {

  console.log("rerender w location", location)

  function getMyLocation() {
    let geo = navigator.geolocation;
    let opts = {
      enableHighAccuracy: true,
      timeout: 7000 // time after which it will error if info not received
    };

    // this handler can be registered when the position is
    // retrieved and have access to do things with the coords
    let success = (geoPosn) => {
      let crd = geoPosn.coords;
      // crd.latitude, crd.longitude, crd.accuracy
      let fetched_location = {lat: crd.latitude, lng: crd.longitude}
      dispatch({ type: "location/set", data: fetched_location });
    };

    let error = (err) => {
      dispatch({ type: "errors/one", data: "Couldn't detect your location" });
    };

    // Locate me
    geo.getCurrentPosition(success, error, opts);

    // TODO future functionality. live read location and then unregister
    // let watcher_id = geo.watchPosition(success, error, opts)
    // would need effect clean up to cancel
    // return {geo, watcher_id};
  }

  React.useEffect(() => {
    // get my location on mount
    getMyLocation();
  }, []);

  React.useEffect(() => {
    if (location.lat && location.lng) {
      console.log("fetch with location", location)
      api_fetch_local_dispos(location);
    }
  }, [location]);

  return (
    <div>
      <PageHeader />
      <Col className="w-50 mx-auto">
        <div className="mb-3">
          <Row className="d-flex flex-row justify-content-between align-items-center">
            <Col><Leader>{"Around me"}</Leader></Col>
            <Col xs="auto">
              <Button
                variant="primary"
                onClick={() => api_fetch_local_dispos(location)}>
                {"Refresh"}
              </Button>
            </Col>
          </Row>
          {location.lat && <small>{`${location.lat}, ${location.lng}`}</small>}
        </div>
        <div>
          {local_dispos.length > 0 ?
            local_dispos.map((dispo, i) =>
              <Row key={`disp-${dispo.id}`}>
                <Card
                  className="p-4 mb-3">
                  <Card.Title>{dispo.name}</Card.Title>
                  <Card.Subtitle className="mb-3 text-muted">
                    {convertDateTime(dispo.date)}
                  </Card.Subtitle>
                  {session?.user_id &&
                    <Link
                      to={`/dispos/${dispo.id}`}
                      size="sm"
                      className="btn btn-outline-primary">
                      {"Join"}
                    </Link>}
                  </Card>
              </Row>) :
            location.lat && location.lng && <None session={session} />}
        </div>
      </Col>
    </div>
  );

}

function state_to_props({session, location, local_dispos}) {
  return {session, location, local_dispos};
}

// Remember, you get `dispatch` for free as a prop when you do this
export default connect(state_to_props)(Discover);
