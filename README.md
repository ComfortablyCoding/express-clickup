# express-clickup

An Express middleware for handling validation of Clickup [Webhooks](https://clickup.com/integrations/webhooks)

[![Downloads](https://img.shields.io/npm/dm/express-clickup.svg?style=for-the-badge)](https://www.npmjs.com/package/express-clickup)
[![Install size](https://img.shields.io/bundlephobia/min/express-clickup?style=for-the-badge)](https://packagephobia.now.sh/result?p=express-clickup)
![GitHub package.json version](https://img.shields.io/github/package-json/v/ComfortablyCoding/express-clickup?style=for-the-badge)
![NPM](https://img.shields.io/npm/l/express-clickup?style=for-the-badge)

## Installation

```sh
npm install express-clickup
```

## Usage

```javascript
const express = require('express');
const clickupWebhook = require('express-clickup');

const app = express();
app.use(express.json());

// Initialize middleware with config
const clickupWebhookOptions = {
	webhooks: [
		{
			id: '689a169-a000-4985-8676-6902b96d6627',
			secret: 'f7bc83f430538424b13298e6aa6',
		},
	],
};
const isValidClickupWebhook = clickupWebhook(clickupWebhookOptions);

// use the middleware on a route
app.post('/webhook', isValidClickupWebhook, (req, res) => {
	console.log('A valid clickup webhook has been received');
});

app.listen(3000, () => {
	console.log('The server is now live');
});
```

## Disclaimer

The [clickup-express](https://github.com/ComfortablyCoding/clickup-express) package is **unofficial** and therefor not endorsed or affiliated with ClickUp or it's subsidaries.
