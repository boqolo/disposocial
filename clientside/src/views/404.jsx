import React from 'react';
import { Link } from 'react-router-dom';
import { Leader } from "../components/Text";

export default function Default({url}) {
  return (
    <div>
      <Leader>404</Leader>
      <h1>{"That page couldn't be found"}</h1>
      <p>{url}</p>
      <Link class="btn btn-primary" to="/">{"Home"}</Link>
    </div>
  );
}
