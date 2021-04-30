/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { expect } from '../chai';
import ObjectSet from '../../lib/object-set';

describe('ObjectSet getAll', () => {
	it('should return an empty array if the set is empty', () => {
		const set = new ObjectSet();
		expect(set.getAll()).to.deep.equal([]);
	});

	it('should return the elements in the set', () => {
		const set = new ObjectSet([
			{
				foo: 1,
			},
			{
				foo: 2,
			},
		]);

		expect(set.getAll()).to.deep.equal([
			{
				foo: 1,
			},
			{
				foo: 2,
			},
		]);
	});
});
