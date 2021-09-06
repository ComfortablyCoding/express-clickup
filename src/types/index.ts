export interface ClickupWebhook {
	/**
	 * The webhook secret
	 */
	secret: string;

	/**
	 * The webhook id
	 */
	id: string;
}

export interface ClickupMiddlewareConfig {
	/**
	 * The name of the header containing the X-Signature
	 * @default 'x-signature'
	 */
	headerSignature?: string;

	/**
	 * The webhooks for the middleware to listen for
	 * @default []
	 */
	webhooks: Array<ClickupWebhook>;
}
