import React from 'react';
import { connect } from 'react-redux';
import PageHeader from '../components/PageHeader.jsx';
import { Leader } from '../components/Text';
import {
  Form,
  FormControl,
  Button
} from 'react-bootstrap';


function Login({acct_form, dispatch}) {

  const { username, email, passcode, isValid } = acct_form;
  // let history = useHistory();

  React.useEffect(() => {
    let validusername = 0 < username?.length < 15;
    let validemail =  5 < email?.length < 25;
    let validpasscode = 10 <= passcode?.length < 25;
    let valid_uname_or_email = validusername || validemail;

    (valid_uname_or_email && validpasscode) ?
    dispatch({ type: "acct_form/set/valid", data: true }) :
    dispatch({ type: "acct_form/set/valid", data: false })
  }, [username, email, passcode]);

  function handleSuccessRedirect() {
    //history.push("/discover");
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    if (isValid) {
      // TODO need to dispatch on success
      let form = delete { ...acct_form }.isvalid;
      // FIXME WHICH TO USE!??
      // api_create_acct(form);
      // ch_register({ form: form, dispatch: dispatch, redirect: handleSuccessRedirect});
    }
  }

  function handleKey(ev, field) {
    // dispatch if valid addition, else nothing
    // always do check if all form is valid
    // FIXME this uname || email thing could very well not work
    // as expected
    const newVal = ev.target.value;
    switch (field) {
      case "uname_or_email":
        let halfvalidemail = /.+@\w+\..+/.test(newVal);
        if (halfvalidemail) {
          dispatch({ type: "acct_form/set/email", data: newVal });
          dispatch({ type: "acct_form/set/username", data: "" });
        }
        let halfvalidusername = !/[\W]/.test(newVal);
        if (halfvalidusername) {
          dispatch({ type: "acct_form/set/username", data: newVal });
          dispatch({ type: "acct_form/set/email", data: "" });
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
          <Leader>Log in</Leader>
          <Form.Group>
            <div className="form-floating">
              <FormControl
                type="text"
                placeholder="username_or_email"
                value={username || email}
                onChange={ev => handleKey(ev, "uname_or_email")}
                onKeyPress={ev => pressedEnter(ev)}
                />
              <Form.Label htmlFor="floating-input">{"Username / Email"}</Form.Label>
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
            {"Log in"}
          </Button>

        </Form>

      </div>
    </div>
  );

}

function state2props({acct_form}) {
  return {acct_form}; // wrap in obj cuz connect will package it
}

export default connect(state2props)(Login);
