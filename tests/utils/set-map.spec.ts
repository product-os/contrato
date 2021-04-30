/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { expect } from '../chai';
import { setMap } from '../../lib/utils';

describe('deepEqual', () => {
	it('should return an empty array given an empty set', () => {
		const set = new Set<number>();
		expect(
			setMap(set, (element) => {
				return element * 2;
			}),
		).to.deep.equal([]);
	});

	it('should run the iteratee on all elements', () => {
		const set = new Set([1, 2, 3]);
		expect(
			setMap(set, (element) => {
				return element * 2;
			}),
		).to.deep.equal([2, 4, 6]);
	});
});
