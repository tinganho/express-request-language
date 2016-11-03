
'use strict';

var acceptLanguage = require('accept-language');
var bcp47 = require('bcp47');
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
    req.language = language;
  }
  else {
    language = req.language = acceptLanguage.get(req.headers['accept-language']);
  }

  if(typeof props.localizations === 'function') {
    req.localizations = props.localizations(language);
  }
}

module.exports = function(props) {
  'use strict';

  // Check that the language tag is set and that it is an array
  if(typeof props.languages === 'undefined' || Object.prototype.toString.call(props.languages) !== '[object Array]') {
    throw new TypeError('You must define your languages in an array of strings.');
  }
  props.languages.forEach(function(languageTag) {
    var language = bcp47.parse(languageTag);
    if(language === null) {
      throw new TypeError('Your language tag \'' + languageTag + '\' is not BCP47 compliant. For more info https://tools.ietf.org/html/bcp47.')
    }
  });

  if(props.cookie) {
    if(typeof props.cookie.name !== 'string' || props.cookie.name.length === 0) {
      throw new TypeError('cookie.name setting must be of type string have a length bigger than zero.')
    }
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

  if(typeof props.localizations !== 'undefined' && typeof props.localizations !== 'function') {
    throw new TypeError('Your \'localizations\' setting is not of type function.');
  }
  acceptLanguage.languages(props.languages);

  return function(req, res, next) {
    var language;
    var queryName = props.queryName || 'language';
    var queryLanguage = req.query[queryName];

    if(typeof queryLanguage === 'string' && queryLanguage.length > 1 &&
        props.languages.indexOf(queryLanguage) !== -1) {
      set(props, req, queryLanguage);
      if(typeof props.cookie !== 'undefined') {
        req.cookies[props.cookie.name] = queryLanguage;
        res.cookie(props.cookie.name, queryLanguage, props.cookie.options);
      }
      return next();
    }

    if(queryLanguage === 'default') {
      res.clearCookie(props.cookie.name);
      req.cookies[props.cookie.name] = undefined;
    }

    if(typeof props.cookie !== 'undefined') {
      if(typeof props.cookie.url === 'string') {
        changeLanguageURL.index = 0;
        var match = changeLanguageURL.exec(req.url);
        if (match !== null) {
          if (props.languages.indexOf(match[1]) !== -1) {
            res.cookie(props.cookie.name, match[1], props.cookie.options);
            return res.redirect('back');
          } else {
            return res.status(404).send('The language is not supported.')
          }
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
