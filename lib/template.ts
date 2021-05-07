/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import concat from 'lodash/concat';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';
import isString from 'lodash/isString';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';

import { ContractObject } from './types/types';

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
	contract: ContractObject,
	options: { blacklist?: Set<string> } = {},
	root?: ContractObject,
	breadcrumb?: string[],
): ContractObject =>
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
				return map(value as ContractObject[], (object, index) =>
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
	) as ContractObject;
