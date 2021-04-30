/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { expect } from '../chai';

import Contract from '../../lib/contract';
import CONTRACTS from '../contracts.json';

describe('Contract getChildrenTypes', () => {
	it('should return an empty set if no children', () => {
		const container = new Contract({
			type: 'foo',
			slug: 'bar',
		});

		expect(container.getChildrenTypes()).to.deep.equal(new Set());
	});

	it('should return one type given one child', () => {
		const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object);
		const container = new Contract({
			type: 'foo',
			slug: 'bar',
		});

		container.addChild(contract1);

		expect(container.getChildrenTypes()).to.deep.equal(new Set(['sw.os']));
	});

	it('should ignore duplicate types', () => {
		const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object);
		const contract2 = new Contract(CONTRACTS['sw.os'].debian.jessie.object);
		const container = new Contract({
			type: 'foo',
			slug: 'bar',
		});

		container.addChildren([contract1, contract2]);
		expect(container.getChildrenTypes()).to.deep.equal(new Set(['sw.os']));
	});

	it('should return all children types', () => {
		const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object);
		const contract2 = new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object);
		const container = new Contract({
			type: 'foo',
			slug: 'bar',
		});

		container.addChildren([contract1, contract2]);
		expect(container.getChildrenTypes()).to.deep.equal(
			new Set(['sw.os', 'sw.blob']),
		);
	});

	it('should update the types when adding a contract', () => {
		const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object);
		const contract2 = new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object);
		const container = new Contract({
			type: 'foo',
			slug: 'bar',
		});

		container.addChildren([contract1]);
		container.addChildren([contract2]);
		expect(container.getChildrenTypes()).to.deep.equal(
			new Set(['sw.os', 'sw.blob']),
		);
	});

	it('should consider nested children', () => {
		const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object);
		const contract2 = new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object);
		contract1.addChild(contract2);
		const container = new Contract({
			type: 'foo',
			slug: 'bar',
		});

		container.addChildren([contract1]);

		expect(container.getChildrenTypes()).to.deep.equal(
			new Set(['sw.os', 'sw.blob']),
		);
	});

	it('should consider two level nested children', () => {
		const contract1 = new Contract(CONTRACTS['hw.device-type'].artik10.object);
		const contract2 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object);
		const contract3 = new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object);
		contract2.addChild(contract3);
		contract1.addChild(contract2);

		const container = new Contract({
			type: 'foo',
			slug: 'bar',
		});

		container.addChildren([contract1]);

		expect(container.getChildrenTypes()).to.deep.equal(
			new Set(['hw.device-type', 'sw.os', 'sw.blob']),
		);
	});
});
