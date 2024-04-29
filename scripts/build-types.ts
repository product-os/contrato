/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import cue from 'cuelang-js';
import openapiTS from 'openapi-typescript';

import { promises as fs } from 'fs';
import path from 'path';

const cueToTSTypes = async (input: string) => {
	const exportResults = await cue('export', [input], { '--out': 'openapi' });
	if (exportResults.code !== 0) {
		throw new Error(`Failed to export cue to openapi: ${exportResults.stderr}`);
	}
	const openapi = JSON.parse(exportResults.stdout);
	return openapiTS(openapi, { additionalProperties: true });
};

const typeDir = path.join('lib', 'types');
const typeFile = (filename: string) => path.join(typeDir, filename);

const main = async () => {
	const ts = await cueToTSTypes(typeFile('definitions.cue'));
	const output = typeFile('cuetypes.ts');
	await fs.writeFile(
		output,
		`/* eslint @typescript-eslint/no-empty-interface: 0 */\n${ts}`,
	);
	console.log(`Built types to ${output}`);
};

main().catch((err) => console.error(err));
