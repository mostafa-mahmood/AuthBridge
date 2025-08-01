import { createProxyMiddleware } from 'http-proxy-middleware';
import type { Request } from 'express';
import type { Options } from 'http-proxy-middleware';
import config from '../config/index.config.js';

const proxyOptions: Options = {
	target: config.core.target_server,
	changeOrigin: config.core.change_origin,

	//@ts-ignore
	onProxyReq: (proxyReq, req: Request) => {
		proxyReq.setHeader('X-Real-IP', req.ip);
		proxyReq.setHeader('X-Forwarded-For', req.ip);
		proxyReq.setHeader('X-Forwarded-Proto', req.protocol);

		if (req.get('host')) {
			proxyReq.setHeader('X-Forwarded-Host', req.get('host'));
		}
	},
};

export const proxyMiddleware = createProxyMiddleware(proxyOptions);
