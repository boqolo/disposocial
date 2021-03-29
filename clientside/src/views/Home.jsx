import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { Jumbotron, Button } from 'react-bootstrap';
import { Leader } from '../components/Text';

export default function Home() {

  return (
    <div>
      <PageHeader />
      <Jumbotron className="rounded my-3 w-75 mx-auto">
        <Leader>{"Pop up. Tear down."}</Leader>
        <h2><small>{"Disposocial is an experiment. It is a localized social media bulletin that self-destructs after an amount of time."}</small></h2>
        <p>{"There is no one network. Interact with others by creating or joining Dispos within your geographic radius."}</p>
        <p>{"Attention spans are short and there's already enough content out there on the web."}</p>
        <p>{"Dispos are fleeting. They're here, and they're gone."}</p>
        <br />
        <Link to="/register">
          <Button size="lg">{"Get started"}</Button>
        </Link>
      </Jumbotron>
    </div>
  );

}
