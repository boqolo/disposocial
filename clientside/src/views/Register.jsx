import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import PageHeader from '../components/PageHeader.jsx';
import { api_create-acct } from  '../api.js';

function Register({acct_form, dispatch}) {

  const { username, email, passcode, isValid } = acct_form;

  React.useEffect(() => {
    validusername = 0 < username.length < 15;
    validemail =  5 < newVal.length < 25;
    validpasscode = 10 <= newVal.length < 25;

    (validusername && validemail && validpasscode) ? 
      dispatch({ type: "acct_form/set/valid", data: true }) : 
      dispatch({ type: "acct_form/set/valid", data: false })
  }, [username, email, passcode]);

  function handleSuccessRedirect() {
    let history = useHistory();
    history.push("/discover");
  }

  function handleSubmit() {
    if (isValid) {
      // TODO need to dispatch on success
      form = delete { ...acct_form }.isvalid;
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
        halfvalidusername =  && !/[\W]/.test(newVal);
        if (halfvalidusername) {
          dispatch({ type: "acct_form/set/username", data: newVal });
        }
      case "email":
        halfvalidemail = && /.+@\w+\..+/.test(newVal);
        if (halfvalidemail) {
          dispatch({ type: "acct_form/set/email", data: newVal });
        }
      case "passcode":
        halfvalidpasscode =&& !/[\s\<\>]/.test(newVal);
        if (halfvalidpasscode) {
          dispatch({ type: "acct_form/set/passcode", data: newVal });
        }
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
    <>
      <PageHeader />
      <h1>Register</h1>
      <div class="w-50 mx-auto">
        <div class="form-group">
          <label>Username</label>
          <input 
            type="text" 
            value={username}
            onBlur={ev => handleKey(ev, "username")}
            onKeyPress={ev => pressedEnter(ev)}
            class="metro-input"
            data-role="input" 
            data-prepend="<span class='mif-user'></span>">
          </input>
        </div>

        <div class="form-group">
          <label>Email</label>
          <input 
            type="email"
            value={email}
            class="metro-input"
            onBlur={ev => handleKey(ev, "email")}
            onKeyPress={ev => pressedEnter(ev)}
            data-role="input" 
            data-prepend="<span class='mif-mail'></span>">
          </input>
        </div>

        <div class="form-group">
          <label>Passcode</label>
          <input 
            type="password"
            value={passcode}
            onBlur={ev => handleKey(ev, "passcode")}
            onKeyPress={ev => pressedEnter(ev)}
            class="metro-input"
            data-role="input" 
            data-prepend="<span class='mif-key'></span>">
          </input>
          <small class="text-muted">Must be at least 10 characters</small>
        </div>

        <div class="form-group">
          <button 
            disabled={isValid}
            onClick={handleSubmit}
            class="button large rounded primary">Register
          </button>
        </div>
      </div>
    </>
  );

}

// This is the function that will condense the store
// to the props we want for the component. This destructuring
// syntax will pull out the acct_form part of global state
// and return it as an object
function state2props({acct_form}) {
  return {acct_form}; // wrap in obj cuz connect will package it
  // along with the dispatch function when passing it as a
  // prop to the component. We can destructure the args again later
}

// Redux `connect` returns a new component that subscribes to
// store updates. Giving it a function with 1 arg means it will
// call that function on updates. Implicitly includes `dispatch`
// as a prop to the component so it can update the store if it
// needs to
export default connect(state2props)(Register);
