
'use strict';

var acceptLanguage = require('accept-language');
var changeLanguageURL;


/**
 * Set locals and call localizations
 *
 * @param {Object} props requestLanguage.props
 * @param {Object} req Express request
 * @param {String} language
 * @return void
 * @private
 */
function set(props, req, language) {
  if(language) {
    req.locals.language = language;
  }
  else {
    language = req.locals.language = acceptLanguage.get(req.headers['accept-language']);
  }

  if(typeof props.localizations === 'function') {
    props.localizations(language);
  }
}

module.exports = function(props) {
  'use strict';

  if(props.cookie) {
    if(props.cookie.url) {
      if(!/\{language\}/.test(props.cookie.url)) {
        throw new TypeError('You haven\'t defined the markup `{language}` in your cookie.url settings.');
      }

      if(props.cookie.url.charAt(0) !== '/') {
        props.cookie.url = '/' + props.cookie.url;
      }

      props.cookie.url = '^' + props.cookie.url;

      changeLanguageURL = new RegExp(props.cookie.url
        .replace('/', '\\/')
        .replace('{language}', '(.*)'));
    }
  }

  acceptLanguage.languages(props.languages);

  return function(req, res, next) {
    var language;
    if(typeof props.cookie !== 'undefined') {
      if(typeof props.cookie.url === 'string') {
        changeLanguageURL.index = 0;
        var match = changeLanguageURL.exec(req.url);
        if(match !== null) {
          res.cookie(props.cookie.name, match[1], props.cookie.options);
          return res.redirect('back');
        }
      }

      language = req.cookies[props.cookie.name];
      if(typeof language === 'string') {
        if(props.languages.indexOf(language) !== -1) {
          set(props, req, language);
          return next();
        }
      }
      language = req.cookies[props.cookie.name] = acceptLanguage.get(req.headers['accept-language']);
      res.cookie(props.cookie.name, language, props.cookie.options);
    }

    set(props, req, language);
    next();
  };
};
