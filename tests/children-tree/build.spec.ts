/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { expect } from '../chai';

import { build } from '../../lib/children-tree';
import Contract from '../../lib/contract';

import CONTRACTS from '../contracts.json';

describe('build children tree', () => {
	it('should build a tree with one children', () => {
		const container = new Contract({
			type: 'foo',
			slug: 'bar',
		});

		const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object);
		container.addChild(contract1);

		container.metadata.children = {
			types: new Set(['sw.os']),
			byType: {
				'sw.os': new Set([contract1.metadata.hash]),
			},
			byTypeSlug: {
				'sw.os': {
					debian: new Set([contract1.metadata.hash]),
				},
			},
			map: {
				[contract1.metadata.hash]: contract1,
			},
		};

		expect(build(container)).to.deep.equal({
			sw: {
				os: contract1.raw,
			},
		});
	});

	it('should build a tree with two contracts of different types', () => {
		const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object);
		const contract2 = new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object);

		const container = new Contract({
			type: 'foo',
			slug: 'bar',
		});

		container.addChild(contract1);
		container.addChild(contract2);

		container.metadata.children = {
			types: new Set(['sw.os', 'sw.blob']),
			byType: {
				'sw.os': new Set([contract1.metadata.hash]),
				'sw.blob': new Set([contract2.metadata.hash]),
			},
			byTypeSlug: {
				'sw.os': {
					debian: new Set([contract1.metadata.hash]),
				},
				'sw.blob': {
					nodejs: new Set([contract2.metadata.hash]),
				},
			},
			map: {
				[contract1.metadata.hash]: contract1,
				[contract2.metadata.hash]: contract2,
			},
		};

		expect(build(container)).to.deep.equal({
			sw: {
				os: contract1.raw,
				blob: contract2.raw,
			},
		});
	});

	it('should build a tree with two contracts of the same type', () => {
		const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object);
		const contract2 = new Contract(CONTRACTS['sw.os'].fedora['25'].object);

		const container = new Contract({
			type: 'foo',
			slug: 'bar',
		});

		container.addChild(contract1);
		container.addChild(contract2);

		container.metadata.children = {
			types: new Set(['sw.os']),
			byType: {
				'sw.os': new Set([contract1.metadata.hash, contract2.metadata.hash]),
			},
			byTypeSlug: {
				'sw.os': {
					debian: new Set([contract1.metadata.hash]),
					fedora: new Set([contract2.metadata.hash]),
				},
			},
			map: {
				[contract1.metadata.hash]: contract1,
				[contract2.metadata.hash]: contract2,
			},
		};

		expect(build(container)).to.deep.equal({
			sw: {
				os: {
					debian: contract1.raw,
					fedora: contract2.raw,
				},
			},
		});
	});

	it('should build a tree with two versions of the same slug', () => {
		const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object);
		const contract2 = new Contract(CONTRACTS['sw.os'].debian.jessie.object);

		const container = new Contract({
			type: 'foo',
			slug: 'bar',
		});

		container.addChild(contract1);
		container.addChild(contract2);

		container.metadata.children = {
			types: new Set(['sw.os']),
			byType: {
				'sw.os': new Set([contract1.metadata.hash, contract2.metadata.hash]),
			},
			byTypeSlug: {
				'sw.os': {
					debian: new Set([contract1.metadata.hash, contract2.metadata.hash]),
				},
			},
			map: {
				[contract1.metadata.hash]: contract1,
				[contract2.metadata.hash]: contract2,
			},
		};

		expect(build(container)).to.deep.equal({
			sw: {
				os: {
					debian: [contract1.raw, contract2.raw],
				},
			},
		});
	});

	it('should create a tree of two variants of the same contract', () => {
		const contract1 = new Contract({
			type: 'sw.os',
			slug: 'Debian Wheezy',
			version: 'wheezy',
			requires: [
				{
					type: 'arch.sw',
					slug: 'amd64',
				},
			],
		});

		const contract2 = new Contract({
			type: 'sw.os',
			slug: 'Debian Wheezy',
			version: 'wheezy',
			requires: [
				{
					type: 'arch.sw',
					slug: 'armv7hf',
				},
			],
		});

		const container = new Contract({
			type: 'foo',
			slug: 'bar',
		});

		container.addChild(contract1);
		container.addChild(contract2);

		container.metadata.children = {
			types: new Set(['sw.os']),
			byType: {
				'sw.os': new Set([contract1.metadata.hash, contract2.metadata.hash]),
			},
			byTypeSlug: {
				'sw.os': {
					debian: new Set([contract1.metadata.hash, contract2.metadata.hash]),
				},
			},
			map: {
				[contract1.metadata.hash]: contract1,
				[contract2.metadata.hash]: contract2,
			},
		};

		expect(build(container)).to.deep.equal({
			sw: {
				os: {
					debian: [contract1.raw, contract2.raw],
				},
			},
		});
	});
});
