const { generateSignature, isValidEvent, isValidSignature } = require('./utils');

/**
 * Create a new clickup validation middleware.
 *
 * @param {Object} [config={}] The webhook config
 * @param {String} config.secret The webhook secret
 * @param {String} [config.signatureHeader="x-signature"] The header signature to look for, defaults to X-Signature
 * @returns {Function} middleware
 */
function clickupWebhook(config = {}) {
	const secret = config.secret || '';
	const signatureHeader = config.signatureHeader || 'x-signature';

	// eslint-disable-next-line func-names, consistent-return
	return function (req, res, next) {
		const signature = req.get(signatureHeader);
		const { body } = req;

		// Ensure required header is present
		if (!signature) {
			return res.sendStatus(400);
		}

		// Ensure req.body has been parsed
		if (!Object.prototype.hasOwnProperty.call(req, 'body')) {
			return res.sendStatus(500);
		}

		// Ensure a valid event has been received
		const { event } = body;
		if (!isValidEvent(event)) {
			return res.sendStatus(400);
		}

		// verify signature
		let stringifiedBody;
		try {
			stringifiedBody = JSON.stringify(body);
		} catch (e) {
			return res.sendStatus(400);
		}

		const generatedSignature = generateSignature(stringifiedBody, secret);
		if (!isValidSignature(signature, generatedSignature)) {
			return res.sendStatus(401);
		}
		res.sendStatus(200);
		next();
	};
}

module.exports = clickupWebhook;
