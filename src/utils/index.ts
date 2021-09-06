import crypto from 'crypto';
import { CLICKUP_EVENTS } from './constants';

/**
 * Generate HMAC signature
 *
 * @private
 * @param body The request body
 * @param secret The webhook secret
 * @returns Hash of the body and webhook secret
 */
export function generateSignature(body: string, secret: string): string {
	const hash = crypto.createHmac('sha256', secret).update(body);
	return hash.digest('hex');
}

/**
 * Determine if an event is valid
 *
 * @private
 * @param event An event to check
 */
export function isValidClickupEvent(event: string): boolean {
	return CLICKUP_EVENTS.has(event);
}

/**
 * Determine if two signatures are matching
 *
 * @private
 * @param signature The signature header
 * @param hash The generated hash
 */
export function isValidSignature(signature: string, hash: string): boolean {
	return signature === hash;
}
