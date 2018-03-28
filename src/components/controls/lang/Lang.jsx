import React from 'react';
import {connect} from 'react-redux';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';

// Localization wrapper
class Lang extends React.Component {

  render() {
    return (
      <FormattedMessage
        id={this.props.id}
        defaultMessage={this.props.default || this.props.id}
        values={this.props.values}
      />
    );
  }
}

export default connect(state => ({
  locale: state.locale
}))(Lang);
