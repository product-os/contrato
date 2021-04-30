/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import flatMap from 'lodash/flatMap';
import isEmpty from 'lodash/isEmpty';
import reduce from 'lodash/reduce';
import trim from 'lodash/trim';

/**
 * @module utils
 */

/**
 * @summary Check if two sets are disjoint
 * @function
 * @memberof module:utils
 * @public
 *
 * @param {Set} set1 - first set
 * @param {Set} set2 - second set
 * @returns {Boolean} whether the sets are disjoint
 *
 * @example
 * const set1 = new Set([ 'foo', 'bar' ])
 * const set2 = new Set([ 'baz', 'qux' ])
 *
 * if (utils.areSetsDisjoint(set1, set2)) {
 *   console.log('These sets are disjoint')
 * }
 */
export const areSetsDisjoint = <T>(set1: Set<T>, set2: Set<T>): boolean => {
	for (const element of set1) {
		if (set2.has(element)) {
			return false;
		}
	}

	return true;
};

/**
 * @summary Perform an union operation between sets
 * @function
 * @memberof module:utils
 * @public
 *
 * @param {Set} set1 - first set
 * @param {Set} set2 - second set
 * @returns {Set} union result
 *
 * @example
 * const set1 = new Set([ 1, 2 ])
 * const set2 = new Set([ 3, 4 ])
 *
 * console.log(utils.setUnion(set1, set2))
 * > Set { 1, 2, 3, 4 }
 */
export const setUnion = <T>(set1: Set<T>, set2: Set<T>): Set<T> => {
	const union = new Set(set1);

	for (const element of set2) {
		union.add(element);
	}

	return union;
};

/**
 * @summary Get the first element of a set
 * @function
 * @memberof module:utils
 * @public
 *
 * @param {Set} set1 - set
 * @returns {*} the first set element
 *
 * @example
 * const set = new Set([ 'foo' ])
 * const element = utils.setFirst(set)
 * console.log(element)
 * > 'foo'
 */
export const setFirst = <T>(set1: Set<T>): T => set1.values().next().value;

/**
 * @summary Map a set using an iteratee function
 * @function
 * @memberof module:utils
 * @public
 *
 * @param {Set} set1 - set
 * @param {Function} iteratee - iteratee (value)
 * @returns {Array} mapped set
 *
 * @example
 * const result = utils.setMap(new Set([ 1, 2, 3 ]), (value) => {
 *   return value * 2
 * })
 *
 * console.log(result)
 * > [ 2, 4, 6 ]
 */
export const setMap = <T, V>(set1: Set<T>, iteratee: (arg0: T) => V): V[] => {
	const result: V[] = [];

	for (const element of set1) {
		result.push(iteratee(element));
	}

	return result;
};

/**
 * @summary Compute the cartisian product of a set of sets
 * @function
 * @memberof module:utils
 * @public
 *
 * @description
 * This function combines the first two sets, and then combines
 * the resulting set if the third set, and so on.
 *
 * The iteratee function is called every step, and clients may
 * return undefined to stop evaluating a possible combination.
 *
 * @param {Array[]} sets - sets of sets
 * @param {Function} iteratee - iteratee (accumulator, element)
 * @returns {Array[]} cartesian product
 *
 * @example
 * const product = utils.cartesianProductWith([
 *   [ 1, 2 ],
 *   [ 3, 4 ]
 * ], (accumulator, element) => {
 *   return accumulator.concat([ element ])
 * })
 *
 * console.log(product)
 * > [
 * >   [ 1, 3 ],
 * >   [ 1, 4 ],
 * >   [ 2, 3 ],
 * >   [ 2, 4 ]
 * > ]
 */
export const cartesianProductWith = <T, V>(
	sets: T[][],
	iteratee: (arg0: V, arg1: T) => V | undefined,
	init: V[],
): V[] => {
	const product = reduce(
		sets,
		(accumulator, set1) =>
			set1.length === 0
				? accumulator
				: flatMap(accumulator, (array) =>
						reduce(
							set1,
							(combinations, element) => {
								const combination = iteratee(array, element);
								if (combination) {
									combinations.push(combination);
								}

								return combinations;
							},
							[] as V[],
						),
				  ),
		init,
	);

	// We could have filtered the whole product
	// by non empty arrays, but that means that
	// we would have to innecessarily traverse
	// through a huge set of combinations.
	return product.length === 0 || isEmpty(product[0]) ? ([] as V[]) : product;
};

/**
 * @summary Strip extra blank lines from a multi-line text
 * @function
 * @memberof module:utils
 * @public
 *
 * @param {String} text - text
 * @returns {String} text without the extra blank lines
 *
 * @example
 * const stripped = utils.stripExtraBlankLines('...')
 */
export const stripExtraBlankLines = (text: string): string =>
	trim(text.replace(/(\r?\n){3,}/g, '\n\n'));
