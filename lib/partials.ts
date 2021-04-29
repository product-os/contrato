/*
 * Copyright 2017 resin.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

import Debug from 'debug';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import {
	attempt,
	chain,
	first,
	invokeMap,
	isError,
	join,
	last,
	map,
	merge,
	range,
	reduce,
	split,
	take,
	trim,
} from 'lodash';

import { cartesianProductWith, stripExtraBlankLines } from './utils';
import Contract from './contract';
import { ContractType } from './types/types';

const debug = Debug('partials');

/**
 * @summary Delimiter to use between contract references
 * @type {String}
 * @private
 */
const REFERENCE_DELIMITER: string = '+';

/**
 * @summary Calculate the paths to search for a partial given a contract
 * @function
 * @private
 *
 * @param {String} name - partial name (without extension)
 * @param {Object} context - context contract
 * @param {Object} options - options
 * @param {String} options.baseDirectory - partials directory
 * @param {String[]} options.structure - the type hierarchy of the partials directory
 *
 * @returns {String[]} possible partial paths
 *
 * @example
 * const context = new Contract({ ... })
 * context.addChildren([ ... ])
 *
 * const paths = partials.findPartial('my-partial', context, {
 *   baseDirectory: 'my/partials',
 *   // The base directory hierarchy is <distro>/<stack>
 *   structure: [ 'sw.os', 'sw.stack' ]
 * })
 *
 * paths.forEach((path) => {
 *   console.log(`Trying to load ${path}...`)
 * })
 */
export const findPartial = (
	name: string,
	context: ContractType,
	options: { baseDirectory: string; structure: string[] },
): string[] =>
	chain(options.structure)
		.map((type) => {
			const children = context.getChildrenByType(type);
			const contracts = chain(children)
				.map((contract) => {
					// We need to replace the alias slug with canonical slug when finding partial
					// since the aliases will use canonical slug to avoid duplication.
					const rawContract = contract.toJSON();
					rawContract.slug = contract.getCanonicalSlug();
					return new Contract(rawContract);
				})
				.sortBy((contract) => contract.getSlug())
				.value();

			return [
				join(invokeMap(contracts, 'getReferenceString'), REFERENCE_DELIMITER),
				join(invokeMap(contracts, 'getSlug'), REFERENCE_DELIMITER),
			];
		})
		.thru((combinations) => {
			const products = cartesianProductWith<string, string[]>(
				combinations,
				(accumulator: string[], element: string) =>
					accumulator.concat([element]),
				[[]],
			);

			const slices = reduce(
				range(options.structure.length, 1, -1),
				(accumulator, slice) =>
					accumulator.concat(invokeMap(products, 'slice', 0, slice)),
				[] as string[][],
			);

			const fallbackPaths = chain(combinations)
				.reduce(
					(accumulator, _, index, collection) =>
						map([map(collection, first), map(collection, last)], (list) =>
							take(list, index + 1),
						).concat(accumulator),
					[] as Array<Array<string | undefined>>,
				)
				.value();

			return (products as Array<Array<string | undefined>>)
				.concat(slices)
				.concat(fallbackPaths);
		})
		.map((references) => [join(references, REFERENCE_DELIMITER), name])
		.concat([[name]])
		.map((paths) => {
			const absolutePath = [options.baseDirectory].concat(paths);
			return `${path.join(...absolutePath)}.tpl`;
		})
		.uniq()
		.value();

Handlebars.registerHelper('import', (options) => {
	const settings = options.data.root.settings;

	const partialPaths = findPartial(options.hash.partial, settings.context, {
		baseDirectory: path.join(settings.directory, options.hash.combination),
		structure: map(split(options.hash.combination, REFERENCE_DELIMITER), trim),
	});

	for (const partialPath of partialPaths) {
		const partialContent = attempt(fs.readFileSync, partialPath, {
			encoding: 'utf8',
		});

		if (isError(partialContent)) {
			if ((partialContent as NodeJS.ErrnoException).code === 'ENOENT') {
				debug(`Ignoring ${partialPath}`);
				continue;
			}

			throw partialContent;
		} else if (partialContent instanceof Buffer) {
			throw new Error(`Error reading file: ${partialPath}`);
		}

		debug(`Using ${partialPath}`);

		// We need to prevent handlebars from encoding the string as HTML,
		// and then we need to parse and recurse through the imported partials,
		// in case they have any interpolation that needs to be resolved.
		const safeContent = new Handlebars.SafeString(
			partialContent.slice(0, partialContent.length - 1),
		);
		const builtContent = Handlebars.compile(safeContent.toString())(
			options.data.root,
		);
		return new Handlebars.SafeString(builtContent);
	}

	throw new Error(`Partial not found: ${options.hash.partial}`);
});

/**
 * @example
 *
 * {{#if (eq hw.device-type.data.media.installation "sdcard")}}
 *   SD card
 * {{/if}}
 * {{#if (eq hw.device-type.data.media.installation "usbkey")}}
 *  USB drive
 * {{/if}}
 *
 * {{#if (and hw.device-type.connectivity.wifi  hw.device-type.connectivity.ethernet)}}
 *   Choose network interface
 * {{/if}}
 */
Handlebars.registerHelper({
	eq: (v1, v2) => v1 === v2,
	ne: (v1, v2) => v1 !== v2,
	lt: (v1, v2) => v1 < v2,
	gt: (v1, v2) => v1 > v2,
	lte: (v1, v2) => v1 <= v2,
	gte: (v1, v2) => v1 >= v2,
	and: (...rest) => rest.every(Boolean),
	or: (...rest) => rest.slice(0, -1).some(Boolean),
});

/**
 * @summary Build a template using a context contract
 * @function
 * @public
 * @memberof module:contrato
 * @name module:contrato.buildTemplate
 *
 * @param {String} template - template
 * @param {Object} context - context contract
 * @param {Object} options - options
 * @param {String} options.directory - partials directory
 * @returns {String} built template
 *
 * @example
 * const template = '....'
 * const context = new Contract({ ... })
 * context.addChildren([ ... ])
 *
 * const result = contrato.buildTemplate(template, context, {
 *   directory: './partials'
 * })
 *
 * console.log(result)
 */
export const buildTemplate = (
	template: string,
	context: ContractType,
	options: { directory: string },
): string => {
	const data = merge(
		{
			settings: {
				directory: options.directory,
				context,
			},
		},
		context.toJSON().children,
	);

	return stripExtraBlankLines(Handlebars.compile(template)(data));
};
