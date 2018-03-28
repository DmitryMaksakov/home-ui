import React from 'react';
import {connect} from 'react-redux';
import LocaleSwitcher from "../localeSwitcher/LocaleSwitcher";
import Lang from "../lang/Lang";
import User from "../user/User";

// Header page element
class Element extends React.Component {

  render() {
    const {title} = this.props;

    return (
      <header className="menu">
        <div className="menu-part">
          <div className="menu-element title">
            <Lang id={title}/>
          </div>
        </div>

        {this.props.children}

        <div className="menu-part">
          <div className="menu-element">
            <User/>
          </div>

          <div className="menu-element">
            <LocaleSwitcher/>
          </div>
        </div>
      </header>
    );
  }
}

export default connect(state => ({
}), {})(Element);
