import { Navbar, Nav, Container, Alert, Col, Row, Button } from "react-bootstrap";
import { remove_at } from '../util';
import store from '../store';

export default function HeaderAlert({i, msg, group, success, error, info}) {
  let msgs;
  if (group == "success") {
    msgs = success;
  } else if (group == "error") {
    msgs = error;
  } else {
    msgs = info;
  }

  let variant;
  if (group == "success") {
    variant = "success";
  } else if (group == "error") {
    variant = "danger";
  } else {
    variant = "info"
  }

  console.log("alert with", variant, group, msg, msgs)

  return (
    <Alert className="mb-2 p-1 px-3 align-items-center d-flex flex-row" variant={`${variant}`}>
      <Col>{msg}</Col>
      <Col xs="auto">
        <Button
          size="sm"
          variant={`outline-${variant}`}
          className="text-decoration-none"
          onClick={() => {
            console.log("REmoving")
            store.dispatch({ type: `${group}/set`, data: remove_at(msgs, i) })
          }}>
          {"X"}
        </Button>
      </Col>
    </Alert>
    );
  }
