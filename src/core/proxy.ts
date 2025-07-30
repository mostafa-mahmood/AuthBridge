import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { Request } from 'express';
import { config } from '../config/index.config.js';

const proxyOptions: Options = {
	target: config.targetServer,
	changeOrigin: true,

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
