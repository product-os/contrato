/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { expect } from '../chai';
import { setUnion } from '../../lib/utils';

describe('setUnion', () => {
	it('should return an empty set for the union of two empty sets', () => {
		const set1 = new Set();
		const set2 = new Set();
		const result = new Set();

		expect(setUnion(set1, set2)).to.deep.equal(result);
	});

	it('should return the union of two disjoint sets', () => {
		const set1 = new Set([1, 2]);
		const set2 = new Set([3, 4]);
		const result = new Set([1, 2, 3, 4]);

		expect(setUnion(set1, set2)).to.deep.equal(result);
	});

	it('should return the union of two joint sets', () => {
		const set1 = new Set([1, 2]);
		const set2 = new Set([2, 3]);
		const result = new Set([1, 2, 3]);

		expect(setUnion(set1, set2)).to.deep.equal(result);
	});

	it('should return an inverted result if the arguments are flipped', () => {
		const set1 = new Set([1, 2]);
		const set2 = new Set([3, 4]);

		const result1 = new Set([1, 2, 3, 4]);
		const result2 = new Set([3, 4, 1, 2]);

		expect(setUnion(set1, set2)).to.deep.equal(result1);
		expect(setUnion(set2, set1)).to.deep.equal(result2);
	});

	it('should return the first set if the second one is empty', () => {
		const set1 = new Set([1, 2]);
		const set2 = new Set();

		expect(setUnion(set1, set2)).to.deep.equal(set1);
	});

	it('should return the second set if the first one is empty', () => {
		const set1 = new Set();
		const set2 = new Set([1, 2]);

		expect(setUnion(set1, set2)).to.deep.equal(set2);
	});
});
