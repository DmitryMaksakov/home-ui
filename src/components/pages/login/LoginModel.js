import {createAction, handleActions} from "redux-actions";

// Page name constant
export const LOGIN_PAGE_NAME = 'login';

// Action creators
export const
  usernameChange = createAction('Login.usernameChange'),
  passwordChange = createAction('Login.passwordChange'),
  pending = createAction('Login.pending'),
  setError = createAction('Login.setError');

// Default page state
const DEFAULT_STATE = {
  username: '',
  password: '',
  pending: false,
  error: null
};

// Page reducer
export const reduceLogin = handleActions({
  [usernameChange](state, {payload}) {
    return {...state, username: payload}
  },
  [passwordChange](state, {payload}) {
    return {...state, password: payload}
  },
  [pending](state, {payload}) {
    return {...state, pending: payload}
  },
  [setError](state, {payload}) {
    return {...state, error: payload}
  }
}, DEFAULT_STATE);
