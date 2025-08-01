import pino from 'pino';
import type { Request } from 'express';
import 'dotenv/config';
// ------------------------
// Context Interfaces
// ------------------------

export interface LogUser {
	id?: string;
	ip?: string;
}

export interface LogRequest {
	id?: string;
	method?: string;
	route?: string;
}

export interface LogError {
	message: string;
	stack?: string;
	domain?: string;
	filepath?: string;
	context?: any;
	[key: string]: any;
}

export interface LogContext {
	user?: LogUser;
	request?: LogRequest;
	error?: LogError;
	metadata?: Record<string, any>;
}

// ------------------------
// Base logger setup
// ------------------------

const baseLogger = pino({
	level: process.env.LOG_LEVEL || 'info',
	timestamp: pino.stdTimeFunctions.isoTime,
	base: null,
	transport: {
		target: 'pino-pretty',
	},
});

// ------------------------
// Helpers
// ------------------------

function getRequestContext(req?: Request): Partial<LogContext> {
	const context: LogContext = {};

	if (!req) return context;

	if (req.user?.id || req.ip) {
		context.user = {
			id: req.user?.id?.toString(),
			ip: req.ip,
		};
	}

	context.request = {
		id: req.id?.toString(),
		method: req.method,
		route: req.originalUrl || req.url,
	};

	return context;
}

function processError(error?: unknown): LogError | undefined {
	if (!error || typeof error !== 'object') return;

	const err = error as any;

	const processed: LogError = {
		message: err.message || 'Unknown error',
		stack: err.stack || 'No stack trace',
	};

	if (err.domain) processed.domain = err.domain;
	if (err.filepath) processed.filepath = err.filepath;
	if (err.context) processed.context = err.context;

	for (const key in err) {
		if (!(key in processed)) {
			processed[key] = err[key];
		}
	}

	return processed;
}

// ------------------------
// DRY log dispatcher
// ------------------------

type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

function log(
	level: LogLevel,
	message: string,
	reqOrContext?: Request | LogContext,
	error?: unknown,
	metadata: Record<string, any> = {},
): void {
	let context: LogContext =
		(reqOrContext as Request)?.method !== undefined
			? getRequestContext(reqOrContext as Request)
			: { ...(reqOrContext as LogContext) };

	if (error) context.error = processError(error);
	context.metadata = metadata;

	(baseLogger[level] as any)({ ...context, msg: message });
}

// ------------------------
// Public logger API
// ------------------------

export interface Logger {
	trace: (
		message: string,
		ctx?: Request | LogContext,
		error?: unknown,
		metadata?: Record<string, any>,
	) => void;
	debug: (
		message: string,
		ctx?: Request | LogContext,
		error?: unknown,
		metadata?: Record<string, any>,
	) => void;
	info: (
		message: string,
		ctx?: Request | LogContext,
		error?: unknown,
		metadata?: Record<string, any>,
	) => void;
	warn: (
		message: string,
		ctx?: Request | LogContext,
		error?: unknown,
		metadata?: Record<string, any>,
	) => void;
	error: (
		message: string,
		ctx?: Request | LogContext,
		error?: unknown,
		metadata?: Record<string, any>,
	) => void;
	fatal: (
		message: string,
		ctx?: Request | LogContext,
		error?: unknown,
		metadata?: Record<string, any>,
	) => void;
}

const logger: Logger = {
	trace: (msg, ctx, err, meta) => log('trace', msg, ctx, err, meta),
	debug: (msg, ctx, err, meta) => log('debug', msg, ctx, err, meta),
	info: (msg, ctx, err, meta) => log('info', msg, ctx, err, meta),
	warn: (msg, ctx, err, meta) => log('warn', msg, ctx, err, meta),
	error: (msg, ctx, err, meta) => log('error', msg, ctx, err, meta),
	fatal: (msg, ctx, err, meta) => log('fatal', msg, ctx, err, meta),
};

export default logger;
