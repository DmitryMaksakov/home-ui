import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {Link, withRouter} from "react-router-dom";
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import {faHome} from '@fortawesome/fontawesome-free-solid'
import {HOME_PATH} from "../../../paths";

// Side menu control
class Sidebar extends React.Component {

  render() {
    const {location: {pathname}} = this.props;

    return (
      <nav className="sidebar">
        <div className="logo">
        </div>

        <ul className="sidebar-elements">
          <li className={classNames('sidebar-element', {selected: pathname === HOME_PATH})}>
            <Link to={HOME_PATH}>
              <FontAwesomeIcon icon={faHome} />
            </Link>
          </li>
        </ul>
      </nav>
    );
  }
}

export default connect(state => ({

}), {})(withRouter(Sidebar));
