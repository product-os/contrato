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

import { reduce, set } from 'lodash';
import { ContractType } from '.';
import Contract from './contract';
import { setFirst } from './utils';

/**
 * @module children-tree
 */

/**
 * @summary Build a plain children tree out of a built contract
 * @function
 * @public
 * @memberof module:children-tree
 *
 * @param {Object} contract - contract
 * @returns {Object} children tree
 *
 * @example
 * const contract = new Contract({ ... })
 * contract.addChildren([ ... ])
 *
 * const tree = childrenTree.build(contract)
 */
export const build = (contract: Contract): object => {
	const tree = {};

	for (const type of contract.metadata.children.types) {
		if (contract.metadata.children.byType[type].size === 1) {
			const hash = setFirst<string>(contract.metadata.children.byType[type]);
			const child = contract.getChildByHash(hash);
			if (child === undefined) {
				throw new Error('Error retrieving child');
			}
			set(tree, type, child.toJSON());
			continue;
		}

		for (const slug of Object.keys(
			contract.metadata.children.byTypeSlug[type],
		)) {
			const sources: object[] = [];
			for (const hash of contract.metadata.children.byTypeSlug[type][slug]) {
				const child = contract.getChildByHash(hash);
				if (child === undefined) {
					throw new Error('Error retrieving child');
				}
				sources.push(child.toJSON());
			}

			if (sources.length === 0) {
				continue;
			}

			set(tree, `${type}.${slug}`, sources.length === 1 ? sources[0] : sources);
		}
	}

	return tree;
};

/**
 * @summary Get all source contract children from a children tree
 * @function
 * @public
 * @memberof module:children-tree
 *
 * @param {Object} tree - children tree
 * @returns {Object[]} children source contracts
 *
 * @example
 * const tree = {
 *   hw: {
 *     'device-type': { ... }
 *   },
 *   sw: {
 *     distro: {
 *       debian: { ... },
 *       fedora: { ... }
 *     }
 *   }
 * }
 *
 * childrenTree.getAll(tree).forEach((sourceContract) => {
 *   console.log(sourceContract.slug, sourceContract.version)
 * })
 */
export const getAll = (tree: any): ContractType[] =>
	reduce(
		tree,
		(accumulator, value, _) => {
			if (!value.slug) {
				const out = accumulator.concat(getAll(value));
				return out;
			}

			accumulator.push(value);
			return accumulator;
		},
		[] as ContractType[],
	);
