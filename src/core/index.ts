import express from 'express';
import { proxyMiddleware } from './proxy.js';
import { config } from '../config/index.config.js';

const app = express();

//expects to be run behind another proxy (nginx/cf)
app.set('trust proxy', true);

//reverse proxy middleware
app.use(proxyMiddleware);

app.listen(config.port, () => {
	console.log(`Reverse Proxy Running On PORT: ${config.port}`);
});
