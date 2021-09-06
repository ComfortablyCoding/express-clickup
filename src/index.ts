import type { Request, Response, NextFunction, RequestHandler } from 'express';
import type { ClickupMiddlewareConfig } from './types';
import { generateSignature, isValidClickupEvent, isValidSignature } from './utils';

/**
 * Create a new clickup validation middleware.
 *
 * @param {Object} config The webhook config
 * @param {String} config.secret The webhook secret
 * @param {String} [config.headerSignature="x-signature"] The header signature to look for, defaults to X-Signature
 * @returns {RequestHandler} middleware
 */
function clickupWebhook(config: ClickupMiddlewareConfig): RequestHandler {
	const secret = config.secret || '';
	const headerSignature = config.headerSignature || 'x-signature';

	// eslint-disable-next-line func-names, consistent-return
	return (req: Request, res: Response, next: NextFunction) => {
		const signature = req.get(headerSignature);
		const { body } = req;

		// Ensure required header is present
		if (!signature) {
			return res.sendStatus(400);
		}

		// Ensure req.body has been parsed
		if (!Object.prototype.hasOwnProperty.call(req, 'body')) {
			return res.sendStatus(400);
		}

		// Ensure a valid event has been received
		const { event } = body;
		if (!isValidClickupEvent(event)) {
			return res.sendStatus(400);
		}

		// verify signature
		let stringifiedBody: string;
		try {
			stringifiedBody = JSON.stringify(body);
		} catch (e) {
			return res.sendStatus(500);
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
