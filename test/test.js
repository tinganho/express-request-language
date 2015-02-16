
/**
 * Module dependencies.
 */
var requestLangauge = require('../');
var sinon = require('sinon');
var chai = require('chai');
var expect = require('chai').expect;
var sinonChai = require('sinon-chai');
var spy = sinon.spy;
var stub = sinon.stub;
var noop = function() {};


/**
 * Chai plugins.
 */
chai.should();
chai.use(sinonChai);

/**
 * Get moched request with Accept-Language header
 *
 * @param {String} acceptLanguage
 * @param {String} storedLanguage
 * @return {String}
 * @private
 */
function getRequest(acceptLanguage, storedLanguage) {
  return {
    locals: {},
    headers: {
      'accept-langauge': acceptLanguage
    },
    cookies: {
      language: storedLanguage
    },
    cookie: noop
  };
};

var next = function() {};
var res = {
  writeHead: function() {},
  end: function() {},
  cookie: function() {}
};

/**
 * Specs.
 */
describe('request-language', function() {
  it('should be able to return the default language with no cookie and localization set', function() {
    var middleware = requestLangauge({
      languages: ['en-US', 'zh-CN']
    });
    var req = getRequest('');
    middleware(req, res, next);
    expect(req.language).to.equal('en-US');
  });

  it('should be able to set a named cookie', function() {
    var middleware = requestLangauge({
      languages: ['en-US', 'zh-CN'],
      cookie: {
        name: 'language'
      }
    });
    var req = getRequest('zh-CN;q=0.8,en-US;q=1');
    middleware(req, res, next);
    expect(req.cookies.language).to.equal('en-US');
  });

  it('should be able to set a new cookie', function() {
    var middleware = requestLangauge({
      languages: ['en-US', 'zh-CN'],
      cookie: {
        name: 'language',
        options: {}
      }
    });
    var req = getRequest('zh-CN;q=0.8,en-US;q=1');
    var res = { cookie: spy() };
    middleware(req, res, next);
    res.cookie.should.have.been.calledOnce;
    res.cookie.should.have.been.calledWith('language', 'en-US', {});
  });

  it('should be able to set a new cookie with options', function() {
    var middleware = requestLangauge({
      languages: ['en-US', 'zh-CN'],
      cookie: {
        name: 'language',
        options: { maxAge: 1000 }
      }
    });
    var req = getRequest('zh-CN;q=0.8,en-US;q=1');
    var res = { cookie: spy() };
    middleware(req, res, next);
    res.cookie.should.have.been.calledOnce;
    res.cookie.should.have.been.calledWith('language', 'en-US', { maxAge: 1000 });
  });

  it('should not set a new cookie if it is already set', function() {
    var middleware = requestLangauge({
      languages: ['en-US', 'zh-CN'],
      cookie: {
        name: 'language',
        options: {}
      }
    });
    var req = getRequest('zh-CN;q=0.8,en-US;q=1', 'zh-CN');
    var res = { cookie: spy() };
    middleware(req, res, next);
    res.cookie.should.have.not.been.called;
    expect(req.language).to.equal('zh-CN');
    expect(req.cookies.language).to.equal('zh-CN');
  });

  it('should set a new cookie if the cookie is not in the language set', function() {
    var middleware = requestLangauge({
      languages: ['en-US', 'zh-CN'],
      cookie: {
        name: 'language',
        options: {}
      }
    });
    var req = getRequest('zh-CN;q=0.8,en-US;q=1', 'en-GB');
    var res = { cookie: spy() };
    middleware(req, res, next);
    res.cookie.should.have.been.called;
    res.cookie.should.have.been.calledWith('language', 'en-US', {});
    expect(req.language).to.equal('en-US');
    expect(req.cookies.language).to.equal('en-US');
  });

  it('should be able to set a cookie url', function() {
    var middleware = requestLangauge({
      languages: ['en-US', 'zh-CN'],
      cookie: {
        name: 'language',
        options: {},
        url: 'languages/{language}'
      }
    });
    var req = getRequest('zh-CN;q=0.8,en-US;q=1', 'zh-CN');
    req.url = '/languages/en-US';
    var res = { redirect: spy(), cookie: spy() };
    middleware(req, res, next);
    res.redirect.should.have.been.calledOnce;
    res.redirect.should.have.been.calledWith('back');
    res.cookie.should.have.been.calledOnce;
    res.cookie.should.have.been.calledWith('language', 'en-US', {});
  });

  it('should be able to set a localization(language) function with no stored cookie and no cookie setting', function() {
    var props = {
      languages: ['en-US', 'zh-CN'],
      localizations: stub().returns(noop)
    };
    var middleware = requestLangauge(props);
    var req = getRequest('zh-CN;q=0.8,en-US;q=1');
    middleware(req, res, next);
    props.localizations.should.have.been.calledOnce;
    props.localizations.should.have.been.calledWith('en-US');
    expect(req.localizations).to.be.a('function');
  });

  it('should be able to set a localization(language) function with no stored cookie and with cookie setting', function() {
    var props = {
      languages: ['en-US', 'zh-CN'],
      cookie: {
        name: 'language',
        options: {}
      },
      localizations: stub().returns(noop)
    };
    var middleware = requestLangauge(props);
    var req = getRequest('zh-CN;q=0.8,en-US;q=1');
    middleware(req, res, next);
    props.localizations.should.have.been.calledOnce;
    props.localizations.should.have.been.calledWith('en-US');
    expect(req.localizations).to.be.a('function');
  });

  it('should be able to set a localization(language) function with a stored cookie', function() {
    var props = {
      languages: ['en-US', 'zh-CN'],
      cookie: {
        name: 'language',
        options: {}
      },
      localizations: stub().returns(noop)
    };
    var middleware = requestLangauge(props);
    var req = getRequest('zh-CN;q=0.8,en-US;q=1', 'zh-CN');
    middleware(req, res, next);
    props.localizations.should.have.been.calledOnce;
    props.localizations.should.have.been.calledWith('zh-CN');
    expect(req.localizations).to.be.a('function');
  });

  it('should throw an error if the languages option is not set', function() {
    var props = {
    };
    var method = function() {
      requestLangauge(props);
    };
    expect(method).to.throw('You must define your languages in an array of strings');
  });

  it('should throw an error if the languages option is set but isn\'t bcp47 compliant', function() {
    var props = {
      languages: ['en-US', 'e']
    };
    var method = function() {
      requestLangauge(props);
    };
    expect(method).to.throw('Your language tag \'e\' is not BCP47 compliant. For more info https://tools.ietf.org/html/bcp47.');
  });

  it('should throw an error if the localizations settings is not of type array', function() {
    var props = {
      languages: ['en-US'],
      localizations: []
    };
    var method = function() {
      requestLangauge(props);
    };
    expect(method).to.throw('Your \'localizations\' setting is not of type function.');
  });

  it('should throw an error if cookie is set but not cookie.name', function() {
    var props = {
      languages: ['en-US', 'zh-CN'],
      cookie: {
      }
    };
    var method = function() {
      requestLangauge(props);
    };
    expect(method).to.throw('cookie.name setting must be of type string have a length bigger than zero.');
  });

  it('should throw an error if the localizations settings is not of type array', function() {
    var props = {
      languages: ['en-US'],
      cookie: {
        name: 'language',
        url: '/'
      }
    };
    var method = function() {
      requestLangauge(props);
    };
    expect(method).to.throw('You haven\'t defined the markup `{language}` in your cookie.url settings.');
  });
});
