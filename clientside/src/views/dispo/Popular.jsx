import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Link, useRouteMatch, useHistory, useParams } from 'react-router-dom';
import { Tabs, Form, Card, Tab, Navbar, ButtonGroup, Col, Row, ListGroup, Container, Button, Modal } from 'react-bootstrap';
import DispoHeader from "../../components/DispoHeader.jsx";
import store from '../../store';
import { convertDateTime } from '../../util';
import { ch_post_comment, ch_post_reaction, ch_load_popular } from '../../socket';

function Popular({popular, dispatch}) {

  let { dispoId } = useParams();

  React.useEffect(() => {
    ch_load_popular();
  }, []);

  return (
    <div>
      <Col>
        {popular.map(post =>
          <Row key={`pop-${post.id}`} className="mx-0 mb-4 rounded border-primary border-bottom border-1 border-top-0 rounded-bottom shadow-sm">
            <Card className="rounded p-0 border-bottom-0">
              <Link to={`/dispo/${dispoId}/post/${post.id}`} className="text-reset text-decoration-none">
                <Row className="align-items-center px-3">
                  <Col>
                    <h3 className="fw-lighter">{post.user?.name}</h3>
                  </Col>
                  <Col xs="auto">
                    <p className="fw-lighter fs-6 m-0">{convertDateTime(post.inserted_at)}
                    </p>
                  </Col>
                </Row>
                <Card.Body className="text-wrap text-break">{post.body}</Card.Body>
              </Link>
              <Card.Footer className="py-0 px-3 h-0">
                {`Hits: ${post.interactions}`}
              </Card.Footer>
            </Card>
          </Row>)}
      </Col>
      <Row className="my-4 px-2">
        <Button onClick={ch_load_popular} variant="primary">
          {"Refresh"}
        </Button>
      </Row>
    </div>
  );
}

function state_to_props({popular}) {
  return {popular};
}

export default connect(state_to_props)(Popular);
