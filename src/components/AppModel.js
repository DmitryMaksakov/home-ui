import {createAction, handleActions} from 'redux-actions';
import {config} from '../config';
import {switchLocale} from "./controls/localeSwitcher/LocaleSwitcherModel";

// Action creators
export const
  pathChanged = createAction('App.pathChanged'),
  authInfoResponse = createAction('App.authInfoResponse'),
  logoutResponse = createAction('App.logout'),
  appStarted = createAction('App.started'),
  loggedIn = createAction('App.login');

// Receives current authenticated user info
export async function getAuthInfo() {
  let res = await fetch(config.apiUrl + '/auth/info', {
    credentials: 'include'
  });

  if (res.ok) {
    return await res.json();
  } else {
    return null;
  }
}

// Logs out current logged in user
export function logout() {
  return async (dispatch) => {
    let res = await fetch(config.apiUrl + '/auth/logout', {
      credentials: 'include'
    });

    if (res.ok || res.status === 401) {
      dispatch(logoutResponse());
    }
  }
}

// Starts app execution
export function start() {
  return async (dispatch) => {
    let user = await getAuthInfo();

    if (user) {
      dispatch(authInfoResponse(user));
    }

    dispatch(appStarted());
  }
}

// Default app state
export const DEFAULT_APP_STATE = {
  locale: localStorage.getItem('locale') || config.defaultLocale,
  started: false,
  pages: {}
};

// App reducer
export const reduceApp = handleActions({
  [authInfoResponse](state, action) { return {...state, user: action.payload}},
  [logoutResponse](state) { return {...state, user: null}},
  [switchLocale](state, action) {return {...state, locale: action.payload}},
  [appStarted](state) {return {...state, started: true}}
}, DEFAULT_APP_STATE);

