import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { Jumbotron, Button, Col } from 'react-bootstrap';
import { Leader } from '../components/Text';
import store from '../store';

export default function Home() {

  let { session } = store.getState();

  return (
    <div>
      <PageHeader />
      <Col xs="10" md="9" className="mx-auto">
        <Jumbotron className="rounded my-3 mx-auto">
          <Leader>{"Pop up. Tear down."}</Leader>
          <h2><small>{"Disposocial is a localized social media board that self-destructs after an amount of time."}</small></h2>
          <p>{"There is no one network. Interact with others by creating or joining Dispos within your geographic radius."}</p>
          <p>{"Attention spans are short and there's already enough content out there on the web."}</p>
          <p>{"Dispos are fleeting. They're here, and they're gone."}</p>
          <br />
          <Link to={session.token ? "/discover" : "/register"}>
            <Button size="lg">{"Get started"}</Button>
          </Link>
        </Jumbotron>
      </Col>
    </div>
  );

}
