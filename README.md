request-language [![Build Status](https://travis-ci.org/tinganho/express-request-language.png)](https://travis-ci.org/tinganho/express-request-language)
========================
A middleware to figure out your request's language either by parsing `Accept-Language` header or by looking at a language cookie's value. `request-language` plays nicely with [L10ns][] by abstracting all your language setting logic for you.

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
    url: '/languages/{language}'
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
    url: '/languages/{language}'
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
Define your language tags ordered in highest priority comes first fashion. The language tags must comply with [BCP47][] standard. The [BCP47][] language tag consist of at least the following subtags:

1. A language subtag (`en`, `zh`).
3. A script subtag (`Hant`, `Latn`).
2. A region subtag (`US`, `CN`).

Then language tag has the following syntax:

```
language[-script][-region]
```

Which makes the following language tags `en`, `en-US` and `zh-Hant-TW` all [BCP47][] compliant. Please note that the script tag refers to language script. Some languages use two character sets instead of one. Chinese is a good example of having two character sets instead of one–it has both traditional characters and simplified characters. And for popular languages that uses two or more scripts please specify the script subtag, because it can make an i18n library fetch more specific locale data.

#### cookie (optional) \{Object\}
Setting the cookie property is optional and whenever it is set this middleware will look at the cookie value instead of the `Accept-Language` header. Setting this cookie property is ideal for application that support more than 1 language and allows users to change language.

##### cookie.name
Name of the language cookie. It will store the current language tag of the user's session and remain until `maxAge` expires or changed by `cookie.url`.

##### cookie.options (optional)
The options are the same options as express uses in `res.cooke(name, value. options)`. Please checkout their [documentation](http://expressjs.com/4x/api.html#res.cookie).

##### cookie.url (optional)
Set the change language URL. Lets say that you set the value to `/languages/{language}` in your configurations. If you visit with your browser to `/languages/en-US`. It will actually change your language cookie value to `en-US`.

#### localizations (optional) {Function}
Set the [L10ns][] `requireLocalizations(language)` function. The right language tag will be used and automatically figured out by the `request-language`. [L10ns'][L10ns] `l()` function will be accessible through express' `req.locals.l`. You also need to set a scoped `l` variable before usage, otherwise [L10ns][] can't update localization keys through code traversal:

```javascript
var l = req.locals.l;
```
### Maintainer

Tingan Ho [@tingan87][]

### License
MIT



[L10ns]: http://l10ns.org
[BCP47]: https://tools.ietf.org/html/bcp47
[@tingan87]: https://twitter.com/tingan87
