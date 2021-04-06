import React from 'react';
import { connect } from 'react-redux';
import {
  Switch,
  Route,
  Redirect,
  useRouteMatch,
  useParams,
  useHistory,
  Link
} from 'react-router-dom';
import {
  Form,
  FormControl,
  InputGroup,
  Button
} from 'react-bootstrap';
import PageHeader from '../components/PageHeader.jsx';
import { Leader } from '../components/Text';
import { api_create_acct } from  '../api.js';

function Register({acct_form, dispatch}) {

  const { username, email, passcode, isValid } = acct_form;
  let history = useHistory();

  React.useEffect(() => {
    let validusername = 0 < username?.length < 15;
    let validemail =  5 < email?.length < 25;
    let validpasscode = 10 <= passcode?.length < 25;

    (validusername && validemail && validpasscode) ?
    dispatch({ type: "acct_form/set/valid", data: true }) :
    dispatch({ type: "acct_form/set/valid", data: false })
  }, [username, email, passcode]);

  function handleSubmit(ev) {
    ev.preventDefault();
    console.log("SUbmit clicked")
    let username = ev.target[0].value;
    let email = ev.target[1].value;
    let passcode = ev.target[2].value;
    // TODO need to dispatch on success
    let form = {
      name: username.trim(),
      email: email.trim(),
      password: passcode.trim()
    };

    let success = () => history.replace("/discover");
    api_create_acct(form, success);
    // ch_register({ form: form, dispatch: dispatch, redirect: handleSuccessRedirect});
  }

  function handleKey(ev, field) {
    // dispatch if valid addition, else nothing
    // always do check if all form is valid
    const newVal = ev.target.value;
    switch (field) {
      case "username":
        let halfvalidusername = !/[\W]/.test(newVal);
        if (halfvalidusername) {
          dispatch({ type: "acct_form/set/username", data: newVal });
        }
        break;
      case "email":
        let halfvalidemail = /.+@\w+\..+/.test(newVal);
        if (halfvalidemail) {
          dispatch({ type: "acct_form/set/email", data: newVal });
        }
        break;
      case "passcode":
        let halfvalidpasscode = !/[\s\<\>]/.test(newVal);
        if (halfvalidpasscode) {
          dispatch({ type: "acct_form/set/passcode", data: newVal });
        }
        break;
      default:
        console.error("very bad input received");
    }
  }

  function pressedEnter(ev) {
    if (ev.key === "Enter") {
      handleSubmit();
    }
  }

  return (
    <div>
      <PageHeader />
      <div className="w-50 mx-auto">
        <Form onSubmit={handleSubmit}>
          <Leader>Register</Leader>
          <Form.Group className="mb-3">
            <div className="form-floating">
              <FormControl
                type="name"
                placeholder="username"
                value={username}
                onKeyPress={ev => pressedEnter(ev)}
                />
              <Form.Label htmlFor="floating-input">{"Username"}</Form.Label>
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <div className="form-floating">
              <Form.Control
                type="email"
                placeholder="email"
                value={email}
                onKeyPress={ev => pressedEnter(ev)}
                />
              <Form.Label>{"Email"}</Form.Label>
            </div>
          </Form.Group>

          <Form.Group>
            <div className="form-floating">
              <Form.Control
                type="password"
                placeholder="passcode"
                value={passcode}
                onKeyPress={ev => pressedEnter(ev)}
                />
              <Form.Label>{"Passcode"}</Form.Label>
            </div>
          </Form.Group>

          <Button
            type="submit"
            disabled={isValid}
            size="lg"
            className="btn btn-primary my-4 mx-auto">
            {"Create account"}
          </Button>

        </Form>

      </div>
    </div>
  );

}

/* This is the function that will condense the store
* to the props we want for the component. This destructuring
* syntax will pull out the acct_form part of global state
* and return it as an object
*/
function state2props({acct_form}) {
  return {acct_form}; // wrap in obj cuz connect will package it
  // along with the dispatch function when passing it as a
  // prop to the component. We can destructure the args again later
}

/* Redux `connect` returns a new component that subscribes to
* store updates. Giving it a function with 1 arg means it will
* call that function on updates. Implicitly includes `dispatch`
* as a prop to the component so it can update the store if it
* needs to
*/
export default connect(state2props)(Register);
