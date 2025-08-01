export default {
	testEnvironment: 'node',
	preset: 'ts-jest',
	testMatch: ['**/tests/**/*.test.(ts|js)', '**/tests/**/*.spec.(ts|js)'],
	globals: {
		'ts-jest': {
			isolatedModules: true,
		},
	},
	testPathIgnorePatterns: ['/dist/', '/node_modules/'],
};
