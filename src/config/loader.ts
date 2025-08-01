import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'node:url';

type ConfigMap = Record<string, Record<string, any>>;

// Fix __dirname in ES modules:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadAllConfigs(): ConfigMap {
	const configDir = __dirname;
	const files = fs.readdirSync(configDir);

	const configMap: ConfigMap = {};

	for (const file of files) {
		const ext = path.extname(file);
		if (ext !== '.yml' && ext !== '.yaml') continue;

		const name = path.basename(file, ext);
		const fullPath = path.join(configDir, file);

		let parsed: Record<string, any> = {};
		try {
			const content = fs.readFileSync(fullPath, 'utf8').trim();
			const maybeParsed = content ? yaml.load(content) : {};

			if (typeof maybeParsed === 'object' && maybeParsed !== null) {
				parsed = maybeParsed as Record<string, any>;
			}
		} catch (error) {
			console.warn(
				`Failed to parse YAML in file: ${file}. Treating as empty config.`,
				error,
			);
		}

		configMap[name] = parsed;
	}

	return configMap;
}

export default loadAllConfigs;
