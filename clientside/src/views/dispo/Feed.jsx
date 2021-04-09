import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Link, useRouteMatch, useHistory, useParams } from 'react-router-dom';
import { Tabs, Form, Card, Tab, Navbar, ButtonGroup, Col, Row, ListGroup, Container, Button, Modal } from 'react-bootstrap';
import DispoHeader from "../../components/DispoHeader.jsx";
import store from '../../store';
import { convertDateTime } from '../../util';
import { ch_post_comment, ch_post_reaction } from '../../socket';


function PostComments({postId, comments}) {
  return (
    <div id={`#comms-${postId}`} className="pb-2">
      <h5
        className="px-3 py-1 mb-2 fw-light bg-light border-top">
        Comments
      </h5>
      {comments.map((comm, i) => (
        <Row key={`comm-${postId}-${i}`} className="border-0 mt-0 mx-3 mb-1">
          <Col className="ps-0 pe-1" xs="2">
            <h6 className="mb-0 text-wrap">{comm.username}</h6>
            <h6>
              <small className="very-small fw-light">{convertDateTime(comm.inserted_at)}</small>
            </h6>
          </Col>
          <Col className="py-0 px-0 text-wrap text-break">{comm.body}</Col>
        </Row>
      ))}
    </div>
  );
}

function PostFooterComp({postId, reactions, flags, dispatch}) {

  // console.log("Post footer post", postId)
  // console.log("Reactions are", reactions)

  let { feed } = store.getState();

  function set_commenting(post_id) {
    dispatch({ type: "flags/setone", data: {post_comment_id: post_id} });
  }

  function cancel_commenting() {
    dispatch({ type: "flags/setone", data: {post_comment_id: undefined} });
  }

  function post_comment(ev, post_id) {
    ev.preventDefault();
    let params = {
      post_id: parseInt(post_id),
      body: ev.target[0].value.trim()
    }
    let successCallback = (resp) => {
      cancel_commenting();
    };
    console.log("POSTING COMMENT")
    ch_post_comment(params, successCallback);
  }

  function handleReact(reaction) {
    ch_post_reaction({post_id: parseInt(postId), reaction: reaction});
  }

  function format_reactions(postId) {
    if (reactions[postId]) {
      let { likes, dislikes } = reactions[postId]
      return `+${likes}, -${Math.abs(dislikes)}`
    } else {
      return "0, 0";
    }
  }

  let body;
  if (flags.post_comment_id == postId) {
    body = (
      <Form inline className="w-100 p-1" onSubmit={ev => post_comment(ev, postId)}>
        <Form.Row className="d-flex align-items-center">
          <Col className="w-100 p-0">
            <Form.Control type="text"
              size="sm" placeholder="Comment" /></Col>
            <Col xs="auto" className="ps-2">
            <Button
              type="submit"
              variant="primary"
              size="sm">
              Post
            </Button>
            <Button className="ms-2" variant="outline-secondary" size="sm" onClick={cancel_commenting}>
              Cancel
            </Button>
          </Col>
        </Form.Row>
      </Form>
    );
  } else {
    body = (
      <Row className="p-1 align-items-center w-100">
        <Col xs="auto" className="pe-0">
          <ButtonGroup>
            <Button
              variant="outline-secondary"
              className="w-auto"
              size="sm"
              onClick={() => handleReact(1)}>
              +1
            </Button>
            <Button
              variant="outline-secondary"
              className="w-auto"
              size="sm"
              onClick={() => handleReact(-1)}>
              -1
            </Button>
          </ButtonGroup>
        </Col>
        <Col xs="auto" className="pe-0">
          <Button
            variant="success"
            size="sm"
            onClick={() => set_commenting(postId)}>
            Comment
          </Button>
        </Col>
        <Col className="d-flex justify-content-end">
          <div className="text-muted m-0">
            {format_reactions(postId)}
          </div>
        </Col>
      </Row>
    );
  }

  return (
    <Card.Footer className="py-0 px-2 h-0">
      {body}
    </Card.Footer>
  );
}

let PostFooter = connect(({flags, reactions}) => { return {flags, reactions} })(PostFooterComp);

function Feed({feed, comments, dispatch}) {

  console.log("Feed has", feed)

  let desc = (x, y) => x > y ? x : y;

  return (
    <Col>
      {Object.keys(feed).sort(desc).map((post_id) =>
        <Row key={`post-${post_id}`} className="mx-0 mb-4 rounded border-primary border-bottom border-1 border-top-0 rounded-bottom shadow-sm">
          <Card className="rounded p-0 border-bottom-0">
            <Link to="#" className="text-reset text-decoration-none">
              <Row className="align-items-center px-3">
                <Col>
                  <h3 className="fw-lighter">{feed[post_id].username}</h3>
                </Col>
                <Col xs="auto">
                  <p className="fw-lighter fs-6 m-0">{convertDateTime(feed[post_id].inserted_at)}
                  </p>
                </Col>
              </Row>
              <Card.Body className="text-wrap text-break">{feed[post_id].body}</Card.Body>
            </Link>
            <PostFooter postId={post_id} />
            {comments[post_id] &&
              <PostComments postId={post_id} comments={comments[post_id]} />}
          </Card>
        </Row>)}
    </Col>
  );
}

function state_to_props({feed, comments}) {
  return {feed, comments};
}

export default connect(state_to_props)(Feed);
