/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { expect } from '../chai';
import ObjectSet from '../../lib/object-set';

describe('ObjectSet add', () => {
	it('should add an object to an empty set', () => {
		const set = new ObjectSet();

		set.add({
			foo: 'bar',
		});

		expect(set.getAll()).to.deep.equal([
			{
				foo: 'bar',
			},
		]);
	});

	it('should add an object to a non empty set', () => {
		const set = new ObjectSet([
			{
				foo: 1,
			},
		]);

		set.add({
			foo: 2,
		});

		expect(set.getAll()).to.deep.equal([
			{
				foo: 1,
			},
			{
				foo: 2,
			},
		]);
	});

	it('should not add a duplicate object', () => {
		const set = new ObjectSet([
			{
				foo: 1,
			},
		]);

		set.add({
			foo: 1,
		});

		expect(set.getAll()).to.deep.equal([
			{
				foo: 1,
			},
		]);
	});

	it('should allow the user to set a custom id', () => {
		const set = new ObjectSet([]);

		set.add(
			{
				foo: 1,
			},
			{
				id: 'foo',
			},
		);

		expect(set.data).to.deep.equal({
			foo: {
				foo: 1,
			},
		});
	});
});
