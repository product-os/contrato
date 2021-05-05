/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { expect } from '../chai';

import ObjectSet from '../../lib/object-set';

describe('ObjectSet constructor', () => {
	it('should create an empty set', () => {
		const set = new ObjectSet();
		expect(set.getAll()).to.deep.equal([]);
	});

	it('should create a set with objects', () => {
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

	it('should ignore duplicate objects', () => {
		const set = new ObjectSet([
			{
				foo: 1,
			},
			{
				foo: 1,
			},
		]);

		expect(set.getAll()).to.deep.equal([
			{
				foo: 1,
			},
		]);
	});

	it('should be able to set objects with custom ids', () => {
		const set = new ObjectSet([
			[
				{
					foo: 1,
				},
				{
					id: 'one',
				},
			],
			[
				{
					foo: 2,
				},
				{
					id: 'two',
				},
			],
		]);

		expect(set.getAll()).to.deep.equal([
			{
				foo: 1,
			},
			{
				foo: 2,
			},
		]);

		expect(set.hasId('one')).to.be.true;
		expect(set.hasId('two')).to.be.true;
	});
});
