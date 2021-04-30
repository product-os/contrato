/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

/**
 * @module hash
 */

import objectHash from 'object-hash';

/**
 * @summary Hash a JavaScript object
 * @function
 * @public
 * @memberof module:hash
 *
 * @param {Object} object - object
 * @returns {String} object hash
 *
 * @example
 * const string = hash.hashObject({ foo: 'bar' })
 * console.log(string)
 */
export const hashObject = (object: object): string =>
	objectHash(object, {
		algorithm: 'sha1',
		ignoreUnknown: true,

		// This in particular is a HUGE improvement
		respectType: false,
	});
