/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { expect } from '../chai';

import ObjectSet from '../../lib/object-set';

describe('ObjectSet hasObject', () => {
	it('should return true if the object exists', () => {
		const set = new ObjectSet([
			{
				foo: 1,
			},
			{
				foo: 2,
			},
		]);

		expect(
			set.hasObject({
				foo: 2,
			}),
		).to.be.true;
	});

	it('should return false if the object does not exist', () => {
		const set = new ObjectSet([
			{
				foo: 1,
			},
			{
				foo: 2,
			},
		]);

		expect(
			set.hasObject({
				foo: 3,
			}),
		).to.be.false;
	});
});
