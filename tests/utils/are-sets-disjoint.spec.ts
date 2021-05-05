/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { expect } from '../chai';
import { areSetsDisjoint } from '../../lib/utils';

describe('areSetsDisjoint', () => {
	it('should return true if sets are disjoint', () => {
		const set1 = new Set(['foo', 'bar']);
		const set2 = new Set(['baz', 'qux']);

		expect(areSetsDisjoint(set1, set2)).to.be.true;
		expect(areSetsDisjoint(set2, set1)).to.be.true;
	});

	it('should return false if sets are not disjoint', () => {
		const set1 = new Set(['foo', 'bar']);
		const set2 = new Set(['bar', 'baz']);

		expect(areSetsDisjoint(set1, set2)).to.be.false;
		expect(areSetsDisjoint(set2, set1)).to.be.false;
	});

	it('should return true if both sets are empty', () => {
		expect(areSetsDisjoint(new Set(), new Set())).to.be.true;
	});

	it('should return true if one of the sets is empty', () => {
		const set1 = new Set(['foo', 'bar']);
		const set2 = new Set();

		expect(areSetsDisjoint(set1, set2)).to.be.true;
		expect(areSetsDisjoint(set2, set1)).to.be.true;
	});
});
