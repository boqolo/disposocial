import React from 'react';
import { connect } from 'react-redux';
import {
  Form,
  FormControl,
  InputGroup,
  Button,
  Row,
  Col
} from 'react-bootstrap';
import store from '../../store';
import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom';
import PageHeader from "../../components/PageHeader.jsx";
import { Leader } from '../../components/Text';
import { api_create_dispo } from '../../api';
import { ch_join_dispo } from '../../socket';
import { getMyLocation, clear_errors } from '../../util';

function New({session, location, flags, dispatch}) {

  let { path, url } = useRouteMatch();
  let history = useHistory();

  console.log("Got location", location)
  console.log("check private flag is", flags.check_private_dispo);

  /*
  field(:death, :utc_datetime) # serverside
  field(:latitude, :integer)
  field(:longitude, :integer)
  field(:location, :string) # serverside
  field(:name, :string)
  field(:is_public, :boolean)
  field(:passcode_hash, :string) #serverside

  has_one(:creator, Disposocial.Users.User)
  */

  function handleSubmit(ev) {
    ev.preventDefault();
    console.log("SUbmit clicked")
    let disponame = ev.target[0].value.trim();
    let duration = ev.target[1].value.trim();
    let is_private = flags.check_private_dispo || false;
    let passphrase = ev.target[3].value.trim()
    console.log(disponame, duration, is_private, passphrase, location.lat, location.lng);
    let form = {
      user_id: session.user_id,
      name: disponame,
      duration: duration,
      is_public: !is_private,
      password: passphrase,
      latitude: location.lat,
      longitude: location.lng
    };

    let created = (id) => {
      let redirect = () => {
        history.push(`/dispo/${id}`);
        dispatch({ type: "success/one", data: "Dispo created" });
      };
      clear_errors(dispatch);
      ch_join_dispo(id, redirect, {password: passphrase});
    };

    api_create_dispo(form, created);
    // ch_register({ form: form, dispatch: dispatch, redirect: handleSuccessRedirect});
  }

  function pressedEnter(ev) {
    if (ev.key === "Enter") {
      handleSubmit();
    }
  }

  function handle_check_private() {
    if (flags.check_private_dispo) {
      dispatch({ type: "flags/setone", data: {check_private_dispo: undefined} });
    } else {
      dispatch({ type: "flags/setone", data: {check_private_dispo: true} });
    }
  }

  // React.useEffect(() => {
  //   // check validity
  //   console.log("checking...")
  //   if (location.lat && location.lng) {
  //     dispatch({ type: "flags/valid_dispo", data: true });
  //   } else {
  //     dispatch({ type: "flags/valid_dispo", data: undefined });
  //   }
  // });

  return (
    <div>
      <PageHeader />
      <div className="w-50 mx-auto">
        <Leader>{"Create a Dispo"}</Leader>
        <Row className="my-2 align-items-center justify-content-between">
          <Col>
            <Button
              variant="success"
              onClick={() => getMyLocation(dispatch)}>
              {"Get my location"}
            </Button>
          </Col>
          <Col xs="auto">
            {location.lat && location.lng &&
              <small className="my-1">{`${location.lat}, ${location.lng}`}</small>}
          </Col>
        </Row>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="my-3">
            <div className="form-floating">
              <FormControl
                type="name"
                placeholder="Name"
                onKeyPress={ev => pressedEnter(ev)}
                />
              <Form.Label htmlFor="floating-input">{"Dispo Name"}</Form.Label>
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <div className="form-floating">
              <Form.Control as="select" defaultValue="1">
                <option value="0.10">{"6 minutes"}</option>
                <option value="0.5">Half an hour</option>
                <option value="1.0">One hour</option>
                <option value="2.0">Two hours</option>
                <option value="24.0">{"24 hours"}</option>
              </Form.Control>
              <Form.Label>Duration</Form.Label>
            </div>
          </Form.Group>

          <Form.Group>
            <div className="form-floating">
              <Form.Check
                type="checkbox"
                label="Private"
                onClick={handle_check_private}
                />
            </div>
          </Form.Group>

          {flags.check_private_dispo &&
            <Form.Group>
              <div className="form-floating">
                <Form.Control
                  type="password"
                  placeholder="passphrase"
                  onKeyPress={ev => pressedEnter(ev)}
                  />
                <Form.Label>{"Passphrase"}</Form.Label>
              </div>
              <small className="text-muted">{"Choose a unique phrase. Min 14 characters"}</small>
            </Form.Group>}

          <Button
            type="submit"
            size="lg"
            className="btn btn-primary my-4 mx-auto">
            {"Create Dispo"}
          </Button>

        </Form>

      </div>
    </div>
  );

}

function state_to_props({session, location, flags}) {
  return {session, location, flags};
}

export default connect(state_to_props)(New);
