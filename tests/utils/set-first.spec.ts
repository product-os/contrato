/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { expect } from '../chai';
import { setFirst } from '../../lib/utils';

describe('setFirst', () => {
	it('should return undefined given an empty set', () => {
		const set = new Set();
		expect(setFirst(set)).to.deep.equal(undefined);
	});

	it('should return the element given an empty set with one element', () => {
		const set = new Set(['foo']);
		expect(setFirst(set)).to.deep.equal('foo');
	});

	it('should always return the only element', () => {
		const set = new Set(['foo']);
		expect(setFirst(set)).to.deep.equal('foo');
		expect(setFirst(set)).to.deep.equal('foo');
		expect(setFirst(set)).to.deep.equal('foo');
		expect(setFirst(set)).to.deep.equal('foo');
	});

	it('should return one of the elements given a set with more than one element', () => {
		const set = new Set(['foo', 'bar', 'baz']);
		expect(set.has(setFirst(set))).to.be.true;
	});
});
