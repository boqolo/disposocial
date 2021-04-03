import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Link, useRouteMatch, useHistory, useParams, useLocation } from 'react-router-dom';
import { Tabs, Form, Tab, Navbar, Col, Row, Container, Button, Modal } from 'react-bootstrap';
import DispoHeader from "../../components/DispoHeader.jsx";
import Feed from './Feed';
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
    let params = {
      body: body
    }
    let success = () => {
      store.dispatch({ type: "success/one", data: "Posted!" });
      close();
    };
    ch_post_post(params, success);
    // let file = ev.target[1].files[0];
    // const reader = new FileReader();
    // console.log("params are", body, file)
    // reader.readAsBinaryString(file);
    // reader.onloadend = () => {
    //   let params = {
    //     body: body,
    //     file: ev.target[1].value,
    //     data: reader.result
    //   }
    //   ch_post_post(params);
    //   close();
    // }
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
                encType="multipart/form-data"
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
  let { pathname } = useLocation();
  console.log("URL is", url)
  let { dispoId } = useParams();
  let history = useHistory();

  return (
    <div>
      <DispoHeader />
      <PostingView show={flags.posting} />
      <Row>
        <Col>
          <Tabs
            activeKey={pathname}
            onSelect={path => history.push(path)}
            className="w-100 display-4 bg-light rounded my-2">
            <Tab eventKey={url} title="Live">
              <Feed />
            </Tab>
            <Tab eventKey={`${url}/popular`} title="Popular">
              <h1>Popular</h1>
            </Tab>
            <Tab eventKey={`${url}/mine`} title="Mine">
              <h1>Mine</h1>
            </Tab>
          </Tabs>
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
        <Col xs="2" className="d-flex align-items-start">
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
