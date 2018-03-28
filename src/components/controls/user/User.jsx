import React from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import {faUserCircle} from '@fortawesome/fontawesome-free-solid';
import Lang from '../lang/Lang';
import {LOGIN_PATH} from "../../../paths";

// User info control
class Element extends React.Component {

  render() {
    const loggedIn = this.props.user && this.props.user.id;

    if (!loggedIn) {
      return (
        <div className="user">
          <Link to={LOGIN_PATH}>
            <Lang id="Login"/>
            <i className="fa fa-sign-in"/>
          </Link>
        </div>
      );
    }

    return (
      <div className="user">
        <div className="user__name">
          {this.props.user.username}
        </div>
        <div className="user__icon">
          <FontAwesomeIcon icon={faUserCircle}/>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  user: state.user
}), {})(Element);
