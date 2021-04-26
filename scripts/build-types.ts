import cue from 'cuelang-js';
import { default as openapiTS } from 'openapi-typescript';

import { promises as fs } from 'fs';

const cueToTSTypes = async (input: string) => {
	const cueresult = await cue('export', [input], { '--out': 'openapi' });
	if (cueresult.code !== 0) {
		console.error(cueresult.stderr);
		throw new Error('Error exporting cue as openapi');
	}
	const openapi = JSON.parse(cueresult.stdout);
	return openapiTS(openapi);
};

(async () => {
	cueToTSTypes('types/definitions.cue')
		.catch((err) => console.error(err))
		.then((ts: string) => {
			const output = "types/cuetypes.ts";
			fs.writeFile(output, ts)
			console.log(`Built types to ${output}`);
		});
})();
