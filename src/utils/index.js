const crypto = require('crypto');
const { CLICKUP_EVENTS } = require('./constants');

/**
 * Generate HMAC signature
 *
 * @private
 * @param {String} body The request body
 * @param {String} secret The webhook secret
 * @returns {String} Hash of the body and webhook secret
 */
function generateSignature(body, secret) {
	const hash = crypto.createHmac('sha256', secret).update(body);
	return hash.digest('hex');
}

/**
 * Determine if an event is valid
 *
 * @private
 * @param {String} event An event to check
 * @returns {Boolean}
 */
function isValidEvent(event) {
	return CLICKUP_EVENTS.has(event);
}

/**
 * Determine if two signatures are matching
 *
 * @private
 * @param {String} signature The signature header
 * @param {String} generatedSignature The generated signature
 * @returns {Boolean}
 */
function isValidSignature(signature, hash) {
	return signature === hash;
}

module.exports = {
	generateSignature,
	isValidEvent,
	isValidSignature,
};
