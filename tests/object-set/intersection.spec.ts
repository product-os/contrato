/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { expect } from '../chai';

import ObjectSet from '../../lib/object-set';

describe('ObjectSet intersection', () => {
	it('should calculate the intersection of two sets', () => {
		const set1 = new ObjectSet();
		const set2 = new ObjectSet();

		set1.add({
			foo: 'bar',
		});

		set1.add({
			bar: 'baz',
		});

		set2.add({
			bar: 'baz',
		});

		set2.add({
			qux: 'foo',
		});

		set1.intersection(set2);

		expect(set1.getAll()).to.deep.equal([
			{
				bar: 'baz',
			},
		]);
	});

	it('should return the instance', () => {
		const set1 = new ObjectSet();
		const set2 = new ObjectSet();

		set1.add({
			foo: 'bar',
		});

		set2.add({
			foo: 'bar',
		});

		expect(set1.intersection(set2)).to.deep.equal(set1);
	});

	it('should calculate the intersection of two disjoint sets', () => {
		const set1 = new ObjectSet();
		const set2 = new ObjectSet();

		set1.add({
			foo: 'bar',
		});

		set1.add({
			bar: 'baz',
		});

		set2.add({
			qux: 'foo',
		});

		set1.intersection(set2);

		expect(set1.getAll()).to.deep.equal([]);
	});

	it('should return an empty array if the left set is empty', () => {
		const set1 = new ObjectSet();
		const set2 = new ObjectSet();

		set2.add({
			qux: 'foo',
		});

		set1.intersection(set2);

		expect(set1.getAll()).to.deep.equal([]);
	});

	it('should return an empty array if the right set is empty', () => {
		const set1 = new ObjectSet();
		const set2 = new ObjectSet();

		set1.add({
			qux: 'foo',
		});

		set1.intersection(set2);

		expect(set1.getAll()).to.deep.equal([]);
	});

	it('should take custom ids into account', () => {
		const set1 = new ObjectSet();
		const set2 = new ObjectSet();

		set1.add(
			{
				foo: 'bar',
			},
			{
				id: 'foobar',
			},
		);

		set1.add(
			{
				bar: 'baz',
			},
			{
				id: 'barbaz',
			},
		);

		set2.add(
			{
				bar: 'baz',
			},
			{
				id: 'barbaz',
			},
		);

		set2.add(
			{
				qux: 'foo',
			},
			{
				id: 'quxfoo',
			},
		);

		set1.intersection(set2);

		expect(set1.getAll()).to.deep.equal([
			{
				bar: 'baz',
			},
		]);
	});

	it('should trust ids rather than objects', () => {
		const set1 = new ObjectSet();
		const set2 = new ObjectSet();

		set1.add(
			{
				foo: 'bar',
			},
			{
				id: 'foobar',
			},
		);

		set1.add(
			{
				bar: 'baz',
			},
			{
				id: 'barbaz',
			},
		);

		set2.add(
			{
				bar: 'baz',
			},
			{
				id: 'barbaz2',
			},
		);

		set2.add(
			{
				qux: 'foo',
			},
			{
				id: 'quxfoo',
			},
		);

		set1.intersection(set2);

		expect(set1.getAll()).to.deep.equal([]);
	});
});
