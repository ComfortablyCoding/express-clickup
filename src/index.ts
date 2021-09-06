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
	const headerSignature = config.headerSignature || 'x-signature';
	const webhooks = config.webhooks || [];

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
		const { event, webhook_id } = body;
		if (!isValidClickupEvent(event)) {
			return res.sendStatus(400);
		}

		// Ensure this is a webhook we wish to listen to
		const webhook = webhooks.find(({ id }) => id === webhook_id);
		if (!webhook) {
			return res.sendStatus(401);
		}

		// verify signature
		let stringifiedBody: string;
		try {
			stringifiedBody = JSON.stringify(body);
		} catch (e) {
			return res.sendStatus(500);
		}

		const generatedSignature = generateSignature(stringifiedBody, webhook.secret);
		if (!isValidSignature(signature, generatedSignature)) {
			return res.sendStatus(401);
		}

		res.sendStatus(200);
		next();
	};
}

module.exports = clickupWebhook;
