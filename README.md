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
  cookie: 'language',
  url: 'languages/{language}'
}));
...
```

### Usage with L10ns

```javascript
var requestLanguage = require('express-request-language');
var express = require('express');
var localizations = require('path/to/l10ns/output/all');
var app = express();

app.use(requestLanguage({
  languages: ['en-US', 'zh-CN'],
  cookie: 'language',
  url: 'languages/{language}',
  localizations: localizations
}));
...
```

### Options

#### languages
Define your languages

#### cookie (optional)

#### url (optional)
Change your language by setting a different value to your cookie. A Markup needs to be defined that '{language}'.
