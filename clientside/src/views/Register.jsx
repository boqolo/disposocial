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

  function handleSuccessRedirect() {
    history.push("/discover");
  }

  function handleSubmit(ev) {
    ev.preventDefault(); // needed because form submission default
    // forces a page load
    if (isValid) {
      // TODO need to dispatch on success, clear acct_form state
      let form = delete { ...acct_form }.isvalid;
      // FIXME WHICH TO USE!??
      // api_create_acct(form);
      // ch_register({ form: form, dispatch: dispatch, redirect: handleSuccessRedirect});
    }
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
      <div class="w-50 mx-auto">
        <Form onSubmit={handleSubmit}>
          <Leader>Register</Leader>
          <Form.Group>
            <div className="form-floating">
              <FormControl
                type="name"
                placeholder="username"
                value={username}
                onChange={ev => handleKey(ev, "username")}
                onKeyPress={ev => pressedEnter(ev)}
                />
              <Form.Label htmlFor="floating-input">{"Username"}</Form.Label>
            </div>
          </Form.Group>

          <Form.Group>
            <div className="form-floating">
              <Form.Control
                type="email"
                placeholder="email"
                value={email}
                onChange={ev => handleKey(ev, "email")}
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
                onChange={ev => handleKey(ev, "passcode")}
                onKeyPress={ev => pressedEnter(ev)}
                />
              <Form.Label>{"Passcode"}</Form.Label>
            </div>
          </Form.Group>

          <Button
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
