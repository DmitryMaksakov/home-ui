import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {pathChanged} from "../../AppModel";

// This control dispatches path change
class PathDispatcher extends React.Component {

  componentDidMount() {
    const {history, pathChanged} = this.props;

    history.listen((path) => {
      pathChanged(path.pathname);
    });
  }

  render() {
    return null;
  }
}

export default connect(null, {pathChanged})(withRouter(PathDispatcher));

