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

/**
 * Contract variants are syntax sugar that allows the client
 * to express multiple different contracts that share many
 * properties in common as a single object, to avoid repetition.
 */

/**
 * @module variants
 */

import { omit, reduce, map, concat, mergeWith, isArray } from 'lodash';
import { ContractType } from './types/types';

/**
 * @summary The name of the contract property that contains variants
 * @type {String}
 * @constant
 */
const VARIANTS_PROPERTY = 'variants';

/**
 * @summary Build contract variants
 * @function
 * @public
 * @memberof module:variants
 *
 * @description
 * A contract might declare a set of variants of itself as a way
 * to express many different related contracts that share a large
 * set of properties in a single contract to avoid duplication.
 *
 * Before this type of contract can be used, you need to build
 * the variants, and get a list of the final contracts.
 *
 * @param {Object} contract - contract
 * @returns {Object[]} contracts
 *
 * @example
 * const contracts = variants.build({
 *   type: 'distro',
 *   name: 'Debian',
 *   slug: 'debian',
 *   variants: [
 *     {
 *       version: 'wheezy'
 *     },
 *     {
 *       version: 'jessie'
 *     }
 *   ]
 * })
 */
export const build = (contract: ContractType): ContractType[] => {
	const variants: object[] = contract[VARIANTS_PROPERTY] || [];
	const base = omit(contract, [VARIANTS_PROPERTY]);

	return variants.length === 0
		? [base]
		: reduce(
				variants,
				(accumulator, variation) =>
					concat(
						accumulator,
						map(build(variation), (template) =>
							mergeWith({}, base, template, (object, source) =>
								isArray(object) ? concat(object, source) : undefined,
							),
						),
					),
				[] as ContractType[],
		  );
};
