import logger from '../../../src/logger/logger';
import type { Request } from 'express';

describe('Logger Module', () => {
	const fakeReq = {
		method: 'GET',
		ip: '127.0.0.1',
		id: 'req123',
		originalUrl: '/api/test',
		user: { id: 'user456' },
	} as unknown as Request;

	const fakeError = new Error('Something went wrong');
	(fakeError as any).domain = 'auth';
	(fakeError as any).filepath = '/auth/service.js';
	(fakeError as any).context = { step: 'validation' };
	(fakeError as any).customProp = 'customValue';

	beforeEach(() => {
		jest.clearAllMocks();
	});
	// Should not throw
	test('logs info with request context', () => {
		logger.info('Request received', fakeReq);
		expect(true).toBe(true);
	});

	test('logs error with full error context', () => {
		logger.error('Error occurred', fakeReq, fakeError);
		expect(true).toBe(true);
	});

	test('logs without request context', () => {
		logger.debug('No req context provided');
		expect(true).toBe(true);
	});

	test('logs with custom context', () => {
		logger.info('Manual context', {
			user: { id: 'u1' },
			request: { method: 'POST' },
		});
		expect(true).toBe(true);
	});

	test('logs with only metadata', () => {
		logger.warn('Just metadata', undefined, undefined, { job: 'clean-up' });
		expect(true).toBe(true);
	});

	test('logs fatal with everything', () => {
		logger.fatal('Critical failure', fakeReq, fakeError, {
			traceId: 'abc-xyz',
		});
		expect(true).toBe(true);
	});
});
