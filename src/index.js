import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from  'react-redux';
import thunk from 'redux-thunk';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import {IntlProvider, addLocaleData} from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import ruLocaleData from 'react-intl/locale-data/ru';
import enMessages from './messages/en.json';
import ruMessages from './messages/ru.json';
import {PrivateRoute} from './components/PrivateRoute';
import {
  LOGIN_PATH,
  HOME_PATH
} from "./paths";
import {DEFAULT_APP_STATE, reduceApp, start} from "./components/AppModel";
import App from './components/App';
import Home from './components/pages/home/Home';
import Login from './components/pages/login/Login'
import PathDispatcher from './components/controls/pathDispatcher/PathDispatcher';
import {HOME_PAGE_NAME, reduceHome} from "./components/pages/home/HomeModel";
import {LOGIN_PAGE_NAME, reduceLogin} from "./components/pages/login/LoginModel";

// Store creation
const
  store = createStore(reduceRoot, applyMiddleware(thunk)),
  {dispatch, getState} = store;

// Localization messages
const messages = {
  en: enMessages,
  ru: ruMessages
};

// Root reducer
function reduceRoot(state = DEFAULT_APP_STATE, action) {
  return {
    ...reduceApp(state, action),
    pages: {
      [HOME_PAGE_NAME]: reduceHome(state.pages[HOME_PAGE_NAME], action),
      [LOGIN_PAGE_NAME]: reduceLogin(state.pages[LOGIN_PAGE_NAME], action)
    }
  };
}

// Adding locales data
addLocaleData(enLocaleData);
addLocaleData(ruLocaleData);

// Checks if user is authenticated
function isAuthenticated() {
  let {user} = getState();

  return user && user.id;
}

// Checks if user is administrator
function isAdmin() {
  let {user} = getState();

  return user && user.id && user.isAdmin;
}

// Render method
let render = () => {
  let locale = getState().locale;

  ReactDOM.render(
    <IntlProvider locale={locale} messages={messages[locale]}>
      <Provider store={store}>
        <Router>
          <App>
            <PrivateRoute path={HOME_PATH} exact component={Home} isAuthenticated={isAuthenticated}/>
            <Route path={LOGIN_PATH} component={Login}/>
            <PathDispatcher/>
          </App>
        </Router>
      </Provider>
    </IntlProvider>,
    document.getElementById('app'));
};

// Re-render app on events from store
store.subscribe(render);

// Starting app
dispatch(start());
