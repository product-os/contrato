/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { expect } from '../chai';

import ObjectSet from '../../lib/object-set';

describe('ObjectSet hasId', () => {
	it('should return true if the id exists', () => {
		const set = new ObjectSet();

		set.add(
			{
				foo: 1,
			},
			{
				id: 'aaa',
			},
		);

		set.add(
			{
				foo: 2,
			},
			{
				id: 'bbb',
			},
		);

		expect(set.hasId('aaa')).to.be.true;
	});

	it('should return false if the id does not exist', () => {
		const set = new ObjectSet();

		set.add(
			{
				foo: 1,
			},
			{
				id: 'aaa',
			},
		);

		set.add(
			{
				foo: 2,
			},
			{
				id: 'bbb',
			},
		);

		expect(set.hasId('ccc')).to.be.false;
	});
});
