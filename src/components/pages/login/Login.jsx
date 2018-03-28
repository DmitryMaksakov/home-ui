import React from 'react';
import {connect} from 'react-redux';
import {injectIntl} from 'react-intl';
import classNames from 'classnames';
import {Redirect} from 'react-router-dom';
import Lang from '../../controls/lang/Lang';
import {getAuthInfo, authInfoResponse, loggedIn} from '../../AppModel'
import {config} from '../../../config';
import {HOME_PATH} from "../../../paths";
import {LOGIN_PAGE_NAME, passwordChange, usernameChange, pending, setError} from "./LoginModel";

// Login page
class Login extends React.Component {

  // On form submit
  async submitHandler(e) {
    e.preventDefault();

    let {page, loggedIn, authInfoResponse, pending, setError} = this.props;

    if (page.pending) return;

    pending(true);

    const res = await fetch(config.apiUrl + '/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: new Headers({'Content-type': 'application/x-www-form-urlencoded'}),
      body: `username=${page.username}&password=${page.password}`
    });

    if (res.ok) {
      loggedIn(await res.json());
      authInfoResponse(await getAuthInfo());
    } else {
      setError(res.status);
    }

    pending(false);

    return false;
  };

  // On component mount
  componentDidMount() {
    let {intl: {formatMessage}} = this.props;
    document.title = formatMessage({id: 'Login_Title', defaultMessage: 'Login_Title'});
  }

  // Renders page
  render() {
    let {intl: {formatMessage}, page, usernameChange, passwordChange, user} = this.props;

    if (user) {
      return (
        <Redirect to={HOME_PATH}/>
      )
    }

    return (
      <div className="login-page page">
        <form onSubmit={e => this.submitHandler(e)}>
          <div>
            <label>
              <Lang id="Username:"/>
            </label>

            <input
               type="text"
               name="username"
               value={page.username}
               onChange={e => usernameChange(e.target.value)}
               required
            />
          </div>

          <div>
            <label>
              <Lang id="Password:"/>
            </label>

            <input
               type="password"
               name="password"
               value={page.password}
               onChange={e => passwordChange(e.target.value)}
               required
               pattern=".{5,}"
               title={formatMessage({id: '5 characters minimum', defaultMessage: '5 characters minimum'})}
            />
          </div>

          {
            page.error &&
            <div className="error">
              {page.error === 400 && <Lang id="Sorry, check username or password"/>}
              {page.error === 403 && <Lang id="Sorry, this user is banned"/>}
            </div>
          }

          <div>
            <input
               className={classNames('btn btn-default', {'disabled': page.pending})}
               type="submit"
               value={
                 !page.pending ?
                   formatMessage({id: 'Log In', defaultMessage: 'Log In'}) :
                   formatMessage({id: 'Log In', defaultMessage: 'Log In'}) + '...'
                }
            />
          </div>
        </form>
      </div>
    );
  }
}

export default connect(state => ({
  user: state.user,
  page: state.pages[LOGIN_PAGE_NAME]
}), {loggedIn, authInfoResponse, usernameChange, passwordChange, pending, setError})(injectIntl(Login));
