import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {config} from '../../../config';
import {switchLocale} from './LocaleSwitcherModel';
import Lang from '../lang/Lang';

// Locale switcher control
class LocaleSwitcher extends React.Component {
  render() {
    const
      {selectedLocale, switchLocale} = this.props,
      availableLocales = config.locales.filter(l => l !== selectedLocale);

    return (
      <div className="locale-switcher">
        {
          availableLocales.length > 1 &&
          availableLocales.map(locale => {
            return (
              <div className={classNames(
                'locale-switcher__locale button',
                {'locale-switcher__locale--selected': locale === selectedLocale})}
                  key={locale}
                  onClick={() => switchLocale(locale)}>
              {locale}
            </div>)
          })
        }

        {
          availableLocales.length === 1 &&
            <div className="locale-switcher__locale button" onClick={() => switchLocale(availableLocales[0])}>
              <Lang id={selectedLocale} />
            </div>
        }
      </div>
    );
  }
}

export default connect(state => ({
  selectedLocale: state.locale
}), {switchLocale})(LocaleSwitcher);
