import express, { Express } from 'express';
import request from 'supertest';
import { clickupWebhook } from '../src';

let app: Express;

beforeAll(() => {
	app = express();
	app.use(express.json());

	const clickupWebhookOptions = {
		webhooks: [{ id: '7689a169-a000-4985-8676-6902b96d6627', secret: 'secret' }],
	};

	const isValidClickupWebhook = clickupWebhook(clickupWebhookOptions);

	app.post('/webhook', isValidClickupWebhook);
});

describe('clickup webhook middleware, invalid path(s)', () => {
	test('should return 400 if no signature header is found', async () => {
		const response = await request(app).post('/webhook').set('Accept', 'application/json');
		expect(response.statusCode).toBe(400);
	});

	test('should return 400 if an invalid event is provided', async () => {
		const response = await request(app)
			.post('/webhook')
			.set('Accept', 'application/json')
			.set('X-Signature', 'signature')
			.send({ event: 'invalidEvent' });
		expect(response.statusCode).toBe(400);
	});

	test('should return 401 if webhook id not found', async () => {
		const response = await request(app)
			.post('/webhook')
			.set('Accept', 'application/json')
			.set('X-Signature', 'signature')
			.send({
				webhook_id: 'invalid-webhook-id',
				event: 'taskCreated',
				task_id: 'c0j',
			});
		expect(response.statusCode).toBe(401);
	});

	test('should return 401 if signatures do not match ', async () => {
		const response = await request(app)
			.post('/webhook')
			.set('Accept', 'application/json')
			.set('X-Signature', 'signature')
			.send({
				webhook_id: '7689a169-a000-4985-8676-6902b96d6627',
				event: 'taskCreated',
				task_id: 'c0j',
			});
		expect(response.statusCode).toBe(401);
	});
});

describe('clickup webhook middleware, valid path(s)', () => {
	test('should return 200 if signatures match and a valid event is provided', async () => {
		const response = await request(app)
			.post('/webhook')
			.set('Accept', 'application/json')
			.set('X-Signature', '4830bf524f6e29a3e8da953936c6f21c1fea2b9669b825d3e1be293ef3416c8c')
			.send({
				webhook_id: '7689a169-a000-4985-8676-6902b96d6627',
				event: 'taskCreated',
				task_id: 'c0j',
			});
		expect(response.statusCode).toBe(200);
	});
});
