/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { expect } from '../chai';

import ObjectSet from '../../lib/object-set';

describe('ObjectSet size', () => {
	it('should return zero if the set has no objects', () => {
		const set = new ObjectSet();
		expect(set.size()).to.equal(0);
	});

	it('should return one if the set has one object', () => {
		const set = new ObjectSet([
			{
				foo: 1,
			},
		]);

		expect(set.size()).to.equal(1);
	});

	it('should return two if the set has two object', () => {
		const set = new ObjectSet([
			{
				foo: 1,
			},
			{
				foo: 2,
			},
		]);

		expect(set.size()).to.equal(2);
	});

	it('should ignore duplicates', () => {
		const set = new ObjectSet([
			{
				foo: 1,
			},
			{
				foo: 1,
			},
		]);

		expect(set.size()).to.equal(1);
	});

	it('should change if new objects are added', () => {
		const set = new ObjectSet();

		set.add({
			foo: 1,
		});

		expect(set.size()).to.equal(1);

		set.add({
			foo: 2,
		});

		expect(set.size()).to.equal(2);
	});
});
