import cue from 'cuelang-js';
import openapiTS from 'openapi-typescript';

import { promises as fs } from 'fs';

const cueToTSTypes = async (input: string) => {
	const exportResults = await cue('export', [input], { '--out': 'openapi' });
	if (exportResults.code !== 0) {
		throw new Error(`Failed to export cue to openapi: ${exportResults.stderr}`);
	}
	const openapi = JSON.parse(exportResults.stdout);
	return openapiTS(openapi);
};

cueToTSTypes('types/definitions.cue')
	.catch((err) => console.error(err))
	.then((ts: string) => {
		const output = "types/cuetypes.ts";
		fs.writeFile(output, ts)
		console.log(`Built types to ${output}`);
	});
