
var acceptLanguage = require('accept-language');

module.exports = function(props) {
  return function(req, res, next) {
    acceptLanguage.languages(props.languages);


    next();
  };
};
