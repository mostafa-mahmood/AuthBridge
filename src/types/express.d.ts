// types/express.d.ts
import 'express';

declare module 'express-serve-static-core' {
	interface Request {
		id?: string;
		user?: {
			id?: string | number;
			[key: string]: any;
		};
	}
}
