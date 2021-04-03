import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Link, useRouteMatch, useHistory, useParams } from 'react-router-dom';
import { Tabs, Form, Tab, Navbar, Col, Row, Container, Button, Modal } from 'react-bootstrap';
import DispoHeader from "../../components/DispoHeader.jsx";
import store from '../../store';
import { ch_post_post } from '../../socket';



function PostingView({show}) {
  function close() {
    store.dispatch({ type: "flags/setone", data: {posting: undefined} });
  }

  function handle_post(ev) {
    ev.preventDefault()
    console.log("Clicked post")
    let body = ev.target[0].value;
    let file = ev.target[1].files[0];
    const reader = new FileReader();
    console.log("params are", body, file)
    reader.readAsBinaryString(file);
    reader.onloadend = () => {
      let params = {
        body: body,
        file: ev.target[1].value,
        data: reader.result
      }
      ch_post_post(params);
      close();
    }
  }

  return (
    <Modal show={show} onHide={close}>
      <Modal.Header>
        <Modal.Title>Post</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handle_post}>
        <Modal.Body>
          <Form.Group>
            <div className="form-floating">
              <Form.Control
                type="text"
                as="textarea"
                placeholder="What to say..."
                />
              <Form.Label>{"What to say..."}</Form.Label>
            </div>
          </Form.Group>
          <Form.Group>
            <div className="form-floating">
              <Form.File
                enctype="multipart/form-data"
                custom
                />
            </div>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" variant="primary">{"Post it"}</Button>
          <Button
            variant="secondary"
            onClick={close}>
            {"Cancel"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

function Dispo({session, flags, dispatch}) {

  let { url } = useRouteMatch();
  let { dispoId } = useParams();
  let history = useHistory();

  return (
    <div>
      <DispoHeader />
      <PostingView show={flags.posting} />
      <Row>
        <Col>
          <Tabs
            activeKey={url}
            onSelect={path => history.push(`${url}${path}`)}
            className="w-100 display-4 bg-light rounded my-4">
            <Tab eventKey="/" title="Live">

            </Tab>
            <Tab eventKey="/popular" title="Popular">

            </Tab>
            <Tab eventKey="/mine" title="Mine">

            </Tab>
          </Tabs>
          <Container>
            <h3>{"Posts go here"}</h3>
          </Container>
          <Navbar fixed="bottom" variant="light" bg="light">
            <Container className="py-5 justify-content-end d-flex flex-end">
              <Button
                variant="primary"
                className="fs-1"
                size="lg"
                onClick={() => dispatch({ type: "flags/setone", data: {posting: true} })}>
                {"Post"}
              </Button>
            </Container>
          </Navbar>
        </Col>
        <Col xs="2" className="d-flex align-items-center">
          <h1 className="fw-lighter">Tags</h1>
        </Col>
      </Row>
    </div>
  );

}

function state_to_props({session, flags}) {
  return {session, flags};
}

export default connect(state_to_props)(Dispo);
