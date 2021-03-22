import { combineReducers, createStore } from 'redux';

/*
 * Redux is basically a pattern of mixing together the result of pure functions
 * that return localized state. It is very similar to how Clj-Reframe uses the
 * 'in-memory' database for keeping global state in one place that events
 * can predictably rely on and update. Think the v = f(s) of React.
 *
 * STATE SHOULD ONLY BE CHANGED BY DISPATCHING ACTIONS. DO NOT WRITE DIRECTLY
 * It is up to me to maintain this because JS won't...bummer.
 * 
 * Actions are the interface for state. 
 *
 * Reducer functions have signature:
 *
 *    state, action -> state
 *
 * where action is a:
 *
 *    {type: "what the action does", data: X} 
 *
 * A basic reducer determines what the action means for the state,
 * copies the current state, adds the data from the action to the
 * new copy of state, and returns the new state. *NEW* not updated.
 *
 * Rather than having one main reducer branching off for different
 * action domains (would be a long switch statement), we can write
 * compartmentalized reducers and then melt them together with
 * `combineReducers`.
 */

// Declare initial state
// const init_state = {
//   acct_form: {},
//   join_form: {},
//   create_form: {},
//   local_dispos: []
// };

// Start default state reducers

function error_reducer(state = [], action) {
  switch (action.type) {
    case "error/set":
      return action.data;
    case "error/one":
      return [action.data];
    case "error/add":
      return state.concat([action.data]);
    default:
      return state;
  }
}

function acct_form_reducer(state = {}, action) {
  switch (action.type) {
    case "acct_form/set":
      return action.data;
    case "acct_form/set/username":
      return { ...state, username: action.data };
    case "acct_form/set/email":
      return { ...state, email: action.data };
    case "acct_form/set/passcode":
      return { ...state, passcode: action.data };
    case "acct_form/set/valid":
      return { ...state, isvalid: action.data };
    default:
      return state;
  }
}

function join_form_reducer(state = {}, action) {
  switch (action.type) {
    case "join_form/set":
      return action.data;
    default:
      return state;
  }
}

function create_form_reducer(state = {}, action) {
  switch (action.type) {
    case "create_form/set":
      return action.data;
    default:
      return state;
  }
}

function local_dispos_reducer(state = [], action) {
  switch (action.type) {
    case "local_dispos/add":
      return state.concat([action.data]);
    case "local_dispos/set":
      return action.data;
    default:
      return state;
  }
}

// Declare initial Dispo client state
// const init_dispo_state = {
//   info: [],
//   feed: [],
//   popular: [],
//   tags: [],
//   show: {}
// };

// Start Dispo client state reducers

function info_reducer(state = [], action) {
  switch (action.type) {
    case "info/add":
      return state.concat([action.data]);
    case "info/set":
      return action.data;
    default:
      return state;
  }
}

function feed_reducer(state = [], action) {
  switch (action.type) {
    case "feed/add":
      return state.concat([action.data]);
    case "feed/set":
      return action.data;
    default:
      return state;
  }
}

function popular_reducer(state = [], action) {
  switch (action.type) {
    case "popular/add":
      return state.concat([action.data]);
    case "popular/set":
      return action.data;
    default:
      return state;
  }
}

function tags_reducer(state = [], action) {
  switch (action.type) {
    case "tags/add":
      return state.concat([action.data]);
    case "tags/set":
      return action.data;
    default:
      return state;
  }
}

function show_reducer(state = [], action) {
  switch (action.type) {
    case "show/set":
      return action.data;
    default:
      return state;
  }
}

// Combine state reducers to create global state reducer
let root_reducer = combineReducers({
  error: error_reducer,
  acct_form: acct_form_reducer,
  join_form: join_form_reducer,
  create_form: create_form_reducer,
  local_dispos: local_dispos_reducer,
  info: info_reducer,
  feed: feed_reducer,
  popular: popular_reducer,
  tags: tags_reducer,
  show: show_reducer
});

/* Now, we create our global, in-memory app store.
 * It will have everything it needs to receive a dispatched 
 * action, run it through to the appropriate sub-reducer and
 * return a new global state.
 *
 * A store has this API:
 *    getState() --- self-explanatory
 *    dispatch(action) --- synchronously applies action to state 
 *                          reducer and sets new state
 *    subscribe(listener) --- adds a change listener to execute
 *                            when an action is dispatched
 *    replaceReducer(nextReducer) --- self-explanatory
 */
let store = createStore(root_reducer);

// Finally, we expose the store to the App.
export default store;
