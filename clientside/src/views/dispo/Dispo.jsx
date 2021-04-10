import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Link, useRouteMatch, useHistory, useParams, useLocation } from 'react-router-dom';
import { Tabs, Form, Tab, ListGroup, Navbar, Col, Row, Container, Button, Modal, Jumbotron } from 'react-bootstrap';
import DispoHeader from "../../components/DispoHeader.jsx";
import Feed from './Feed';
import Popular from './Popular';
import DispoInfo from '../../components/DispoInfo';
import store from '../../store';
import { ch_post_post, ch_leave_dispo, ch_load_page } from '../../socket';
import { api_upload_media } from '../../api';
import { reset_dispo_state, convertDateTime, ms_to_min_s, clear_errors } from '../../util';



function PostingView({show}) {
  function close() {
    store.dispatch({ type: "flags/setone", data: {posting: undefined} });
  }

  function handle_post(ev) {
    ev.preventDefault()
    console.log("Clicked post", ev.target)
    let body = ev.target[0].value.trim();
    let params = {
      body: body
    }
    let success = () => {
      store.dispatch({ type: "success/one", data: "Posted!" });
      close();
    };
    let error = () => {
      store.dispatch({ type: "error/add", data: "Failed to create post" });
      close();
    };

    // There's a file upload
    if (ev.target[1].value) {
      let fileObj = ev.target[1].files[0];

      api_upload_media({file: fileObj})
        .then(resp => {
          if (resp.media_hash) {
            let { media_hash } = resp;
            params = {
              ...params,
              media_hash: media_hash,
            }
            console.log("post params are", params);
            ch_post_post(params, success);
          } else {
            console.error("unable to upload media");
            error();
          }
        });
    } else { // regular text only post
      console.log("post params are", params);
      ch_post_post(params, success);
    }
  }

  // function pressedEnter(ev) {
  //   if (ev.key === "Enter") {
  //     handle_post(ev);
  //   }
  // }

  return (
    <Modal show={show} onHide={close}>
      <Modal.Header>
        <Modal.Title>Post</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handle_post} encType="multipart/form-data">
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              as="textarea"
              rows={3}
              placeholder="What to say..."
              />
          </Form.Group>
          <Form.Group>
            <div className="form-floating">
              <Form.File
                accept="image/jpeg, image/png"
                />
            </div>
            <small>{"Images accepted. Max 1.5 MB"}</small>
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

function Dispo({session, curr_dispo, tags, flags, dispatch}) {

  let { url } = useRouteMatch();
  let { pathname } = useLocation();
  console.log("URL is", url)
  let { dispoId } = useParams();
  let history = useHistory();

  if (flags.dispo_dead) {
    store.dispatch({ type: "flags/setone", data: {dispo_dead: undefined} });
    ch_leave_dispo();
    clear_errors(dispatch);
    reset_dispo_state(dispatch);
    dispatch({ type: "success/one", data: "Left Dispo" });
    history.replace("/discover");
  }

  React.useEffect(() => {
    ch_load_page();
  }, []);

  return (
    <div className="mb-5">
      <DispoHeader />
      <PostingView show={flags.posting} />
      <Row>
        <Col xs="4" md="3" className="px-0">
          <DispoInfo />
        </Col>
        <Col>
          <Tabs
            activeKey={pathname}
            onSelect={path => history.push(path)}
            className="w-100 display-6 rounded my-2">
            <Tab eventKey={url} title="Live">
              <Feed />
            </Tab>
            <Tab eventKey={`${url}/popular`} title="Popular">
              <Popular />
            </Tab>
            {/* <Tab eventKey={`${url}/mine`} title="Mine">
              <h1>Mine</h1>
            </Tab> */}
          </Tabs>
        </Col>
        <Col xs="3" md="2" className="d-flex flex-column align-items-start">
          <Row className="w-100 mb-5">
            <Button
              variant="primary"
              size="lg"
              className="fw-lighter fs-4 shadow-sm"
              onClick={() => dispatch({ type: "flags/setone", data: {posting: true} })}>
              Post
            </Button>
          </Row>
          <Row className="w-100">
            <h2 className="fw-lighter">Tags</h2>
            <ListGroup>
              {tags.map((tag, i) =>
                <ListGroup.Item key={`tag-${i}`} action>{JSON.stringify(tag)}</ListGroup.Item>)}
            </ListGroup>
          </Row>
        </Col>
      </Row>
    </div>
  );

}

function state_to_props({session, curr_dispo, tags, flags}) {
  return {session, curr_dispo, tags, flags};
}

export default connect(state_to_props)(Dispo);
