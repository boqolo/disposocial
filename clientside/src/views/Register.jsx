import React from 'react';
import PageHeader from '../components/PageHeader.jsx';

export default function Register() {

  // TODO set state using dispatch, add submit handler thru channel

  return (
    <>
      <PageHeader />
      <h1>Register</h1>
      <div class="w-50 mx-auto">
        <div class="form-group">
          <label>Username</label>
          <input 
            type="text" 
            class="metro-input"
            data-role="input" 
            data-prepend="<span class='mif-user'></span>">
          </input>
        </div>

        <div class="form-group">
          <label>Email</label>
          <input 
            type="email"
            class="metro-input"
            data-role="input" 
            data-prepend="<span class='mif-mail'></span>">
          </input>
        </div>

        <div class="form-group">
          <label>Password</label>
          <input 
            type="password"
            class="metro-input"
            data-role="input" 
            data-prepend="<span class='mif-key'></span>">
          </input>
          <small class="text-muted">Must be at least 10 characters</small>
        </div>

        <div class="form-group">
          <button 
            onClick={() => alert("yey")}
            class="button large rounded primary">Register
          </button>
        </div>
      </div>
    </>
  );

}
