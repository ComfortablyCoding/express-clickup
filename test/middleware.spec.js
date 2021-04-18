const request = require('supertest');
const express = require('express');
const clickupWebhook = require('../src');

// eslint-disable-next-line func-names
describe('Testing clickup webhook middleware', function () {
	before('building test environment', () => {
		this.app = express();
		this.app.use(express.json());

		const clickupWebhookOptions = {
			secret: 'secret',
		};

		const isValidClickupWebhook = clickupWebhook(clickupWebhookOptions);

		this.app.post('/webhook', isValidClickupWebhook);
	});

	it('should return bad request if no signature header is found', (done) => {
		request(this.app).post('/webhook').set('Accept', 'application/json').expect(400, done);
	});

	it('should return bad request if an invalid event is provided', (done) => {
		request(this.app)
			.post('/webhook')
			.set('Accept', 'application/json')
			.set('X-Signature', 'signature')
			.send({ event: 'invalidEvent' })
			.expect(400, done);
	});

	it('should return unauthorized if signatures do not match ', (done) => {
		request(this.app)
			.post('/webhook')
			.set('Accept', 'application/json')
			.set('X-Signature', 'signature')
			.send({
				webhook_id: '7689a169-a000-4985-8676-6902b96d6627',
				event: 'taskCreated',
				task_id: 'c0j',
			})
			.expect(401, done);
	});

	it('should return OK if signatures do not match', (done) => {
		request(this.app)
			.post('/webhook')
			.set('Accept', 'application/json')
			.set('X-Signature', '4830bf524f6e29a3e8da953936c6f21c1fea2b9669b825d3e1be293ef3416c8c')
			.send({
				webhook_id: '7689a169-a000-4985-8676-6902b96d6627',
				event: 'taskCreated',
				task_id: 'c0j',
			})
			.expect(200, done);
	});
});
