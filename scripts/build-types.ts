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

const main = async () => {
  const ts = await cueToTSTypes('lib/types/definitions.cue');
  const output = "lib/types/cuetypes.ts";
  await fs.writeFile(output, ts);
  console.log(`Built types to ${output}`);
};

main().catch(err => console.error(err));