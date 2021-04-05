import React from 'react';
import PageHeader from '../components/PageHeader';
import { Leader } from '../components/Text';
import { Col, Row, Button, DropdownButton, Dropdown, Card, InputGroup, Form } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import store from '../store';
import { api_fetch_local_dispos } from '../api';
import { ch_join_dispo } from '../socket';
import { convertDateTime, getMyLocation, clear_errors } from '../util';

function None({session}) {

  return (
    <div>
      <h2>{"None found in your location"}</h2>
      {session?.user_id &&
        <div className="my-5">
          <Link to="/dispo/new">
            <Button variant="primary" size="lg">{"Create one"}</Button>
          </Link>
      </div>}
    </div>
  );
}

function JoinView({dispo, flags, dispatch}) {

  let history = useHistory();

  function handle_join(id, auth = {}) {
    console.log("Join clicked")
    let redirect = () => {
      clear_errors(dispatch);
      history.replace(`/dispo/${id}`);
      dispatch({ type: "success/one", data: "Dispo joined" });
    };
    ch_join_dispo(id, redirect, auth);
  }

  function handle_auth_join(ev, dispo_id) {
    ev.preventDefault();
    console.log("auth dispo with", ev.target[0].value)
    let params = { password: ev.target[0].value.trim() };
    handle_join(dispo_id, params);
  }

  console.log("falgs after", flags)

  function set_dispo_auth(id) {
    let dispo_auth_flag = `dispo_auth_${id}`;
    console.log("DISPI AUTH FLAG", dispo_auth_flag)
    let flag = {};
    if (!flags[dispo_auth_flag]) {
      flag[dispo_auth_flag] = true;
      console.log("Setting", flag)
      dispatch({ type: "flags/setone", data: flag });
    } else {
      flag[dispo_auth_flag] = undefined;
      dispatch({ type: "flags/setone", data: flag });
    }
  }

  let body;
  if (dispo.is_public) {
    body = (
      <Button variant="primary" onClick={() => handle_join(dispo.id)}>
        {"Join"}
      </Button>
    );
  } else {
    body = (
      <Row className="align-items-center">
        {flags[`dispo_auth_${dispo.id}`] ?
          <Form onSubmit={(ev) => handle_auth_join(ev, dispo.id)}>
            <Row>
              <Col>
                <div className="form-floating">
                  <Form.Control
                    type="password"
                    />
                  <Form.Label>{"Passcode"}</Form.Label>
                </div>
              </Col>
              <Col>
                <Button type="submit" variant="primary">Join</Button>
              </Col>
            </Row>
          </Form>
          :
          <Row>
            <Col>
              <Button
                onClick={() => set_dispo_auth(dispo.id)}
                variant="primary">
                Join
              </Button>
            </Col>
            <Col>
              <small>{"Passphrase required"}</small>
            </Col>
          </Row>}
        </Row>
      );
    }

    return (
      <div>{body}</div>
    );
}

let Join = connect(({flags}) => { return {flags}})(JoinView);

function Discover({session, location, local_dispos, dispatch}) {

  console.log("rerender w location", location)

  React.useEffect(() => {
    // get my location on mount
    if (!location.lat || !location.lng) {
      getMyLocation(dispatch);
    }
  }, []);

  React.useEffect(() => {
    if (location.lat && location.lng && local_dispos.length < 3) {
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
            <Col xs="auto">
              <DropdownButton
                title="Radius"
                onSelect={(rad) => api_fetch_local_dispos(location)}>
                <Dropdown.Item eventKey="5">{"5 mi."}</Dropdown.Item>
              </DropdownButton>
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
                  {convertDateTime(dispo.created)}
                </Card.Subtitle>
                {session?.user_id &&
                  <Join dispo={dispo} />}
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
