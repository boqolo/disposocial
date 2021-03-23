function oldRegister() {

  return (
    <div>
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
  );
}
