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

import {
	concat,
	get,
	isArray,
	isPlainObject,
	isString,
	map,
	mapValues,
} from 'lodash';
import { ContractType } from './types/types';

/**
 * @module template
 */

/**
 * @summary Map object values recursively
 * @function
 * @private
 *
 * @param {Object} object - object
 * @param {Function} callback - callback (value)
 * @param {String[]} [breadcrumb] - location breadcrumb
 * @returns {Object} mapped object
 *
 * @example
 * const result = deepMapValues({
 *   a: 1,
 *   b: 2,
 *   c: 3
 * }, (value) => {
 *   return value * 2
 * })
 *
 * console.log(result)
 * > {
 * >   a: 2
 * >   b: 4
 * >   c: 6
 * > }
 */
const deepMapValues = (
	object: object,
	callback: (arg0: object, arg1: string[]) => object,
	breadcrumb: string[] = [],
): object =>
	!isPlainObject(object)
		? callback(object, breadcrumb)
		: mapValues(object, (value: any, key) => {
				const absoluteKey = concat(breadcrumb, [key]);
				return isPlainObject(value)
					? deepMapValues(value, callback, absoluteKey)
					: callback(value, absoluteKey);
		  });

/**
 * @summary Contract template interpolation regex
 * @type {RegExp}
 * @constant
 */
const TEMPLATE_REGEXP: RegExp = /\{\{(.+?)\}\}/g;
/**
 * @summary Compile contract templates
 * @function
 * @public
 * @memberof module:template
 *
 * @param {Object} contract - contract
 * @param {Object} [options] - options
 * @param {Set} [options.blacklist] - paths to ignore
 * @param {Object} [root] - template root (internally used during recursion)
 * @param {String[]} [breadcrumb] - breadcrumb (internally used during recursion)
 * @returns {Object} applied contract
 *
 * @example
 * const contract = template.compileContract({
 *   type: 'distro',
 *   name: 'debian {{this.version}}',
 *   version: 'wheezy',
 *   slug: 'debian'
 * })
 *
 * console.log(contract)
 * > {
 * >   type: 'distro',
 * >   name: 'debian wheezy',
 * >   version: 'wheezy',
 * >   slug: 'debian'
 * > }
 */
export const compileContract = (
	contract: ContractType,
	options: { blacklist?: Set<string> } = {},
	root?: object,
	breadcrumb?: string[],
): ContractType =>
	deepMapValues(
		contract,
		(value: any, key: string[]) => {
			if (isString(value)) {
				if (options.blacklist) {
					for (const path of options.blacklist) {
						if (key.join('.').startsWith(path)) {
							return value;
						}
					}
				}
				const data = {
					this: root || contract,
				};
				return value.replace(
					TEMPLATE_REGEXP,
					(interpolation, path) => get(data, path) || interpolation,
				);
			}
			if (isArray(value)) {
				return map(value, (object, index) =>
					compileContract(
						object,
						options,
						contract,
						concat(key, [index.toString()]),
					),
				);
			}
			return value;
		},
		breadcrumb,
	);
