import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {injectIntl} from 'react-intl';
import {logout} from './AppModel';
import Sidebar from "./controls/sidebar/Sidebar";

// App component
class App extends React.Component {

  render() {

    return (
      <div className="app">
        <Sidebar/>

        {this.props.children}
      </div>
    );
  }
}

export default connect(state => ({
}), {logout})(withRouter(injectIntl(App)));
