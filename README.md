express-request-language [![Build Status](https://travis-ci.org/tinganho/express-request-language.png)](https://travis-ci.org/tinganho/express-request-language)
========================


### Installation:

```
npm install express-request-language --save
```

### Usage

```javascript
var requestLanguage = require('express-request-language');
var express = require('express');
var app = express();

app.use(requestLanguage({
  languages: ['en-US', 'zh-CN'],
  cookie: {
    name: 'language',
    options: { maxAge: 24*3600*1000 },
    url: '/languages/{language}',
  }
}));
...
```

### Usage with [L10ns](http://l10ns.org)

```javascript
var requestLanguage = require('express-request-language');
var express = require('express');
var localizations = require('path/to/l10ns/output/all');
var app = express();

app.use(requestLanguage({
  languages: ['en-US', 'zh-CN'],
  cookie: {
    name: 'language',
    options: { maxAge: 24*3600*1000 },
    url: '/languages/{language}',
  },
  localizations: localizations
}));

app.get('/', function(req, res, next) {
  // It will use localization from the right language.
  var l = req.locals.l;
  console.log(l('HELLO_WORLD'));
});
...
```

### Options

#### languages \{Array\}
Define your language tags ordered in highest priority first. The language tags must comply with [BCP47 standard][bcp47]. The bcp47 language tag consist of at least of following subtags:

1. A language subtag (`en`, `zh`).
3. A script subtag (`Hant`, `Latn`).
2. A region subtag (`US`, `CN`).

Then language tag has the following syntax:

```
language[-script][-region]
```

Which makes the following language tags `en`, `en-US` and `zh-Hant-TW` all [bcp47][bcp47] compliant. Please note that the script tag refers to language script. Some languages use two character sets instead of one. Chinese is a good example of having two character sets instead of one–it has both traditional characters and simplified characters. And for popular languages that uses two or more scripts please specify the script subtag, because it can make an i18n library fetch more specific locale data.

#### cookie (optional) \{Object\}

##### cookie.name
Name of the language cookie. It will store the current language tag of the user's session and remain until `maxAge` expires or changed by `cookie.url`.

##### cookie.options (optional)
The options are the same options as express uses in `res.cooke(name, value. options)`. Please checkout their [documentation](http://expressjs.com/4x/api.html#res.cookie).

##### cookie.url (optional)
Set the change language URL. Lets say that you set the value to `/languages/{language}` in your configurations. If you visit with your browser to `/languages/en-US`. It will actually change your language cookie value to `en-US`.

#### localizations (optional) {Function}
L10ns `requireLocalizations(language)` function. The right language tag will be used. and automatically figured out by the middleware and L10ns' `l()` function will be accessible through `req.locals.l`. You need to also set it to a scoped `l` variable before usage, otherwise L10ns can't fetch localization keys:

```javascript
var l = req.locals.l;
```

### License
MIT

[bcp47]: https://tools.ietf.org/html/bcp47
