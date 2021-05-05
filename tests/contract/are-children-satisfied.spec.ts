/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { expect } from '../chai';

import Contract from '../../lib/contract';

describe('Contract areChildrenSatisfied', () => {
	it('should return true given a satisfied context', () => {
		const contract = new Contract({
			type: 'foo',
			bar: 'bar',
		});

		contract.addChildren([
			new Contract({
				type: 'sw.os',
				name: 'Debian',
				slug: 'debian',
				requires: [
					{
						or: [
							{
								type: 'hw.device-type',
								slug: 'artik10',
							},
							{
								type: 'hw.device-type',
								slug: 'raspberry-pi',
							},
						],
					},
				],
			}),
			new Contract({
				type: 'hw.device-type',
				slug: 'artik10',
				name: 'Samsung Artik 10',
				requires: [
					{
						type: 'arch.sw',
						slug: 'armv7hf',
					},
				],
			}),
			new Contract({
				type: 'arch.sw',
				slug: 'armv7hf',
				name: 'armv7hf',
			}),
		]);

		expect(contract.areChildrenSatisfied()).to.be.true;
	});

	it('should return false given an unsatisfied context', () => {
		const contract = new Contract({
			type: 'foo',
			bar: 'bar',
		});

		contract.addChildren([
			new Contract({
				type: 'sw.os',
				name: 'Debian',
				slug: 'debian',
				requires: [
					{
						or: [
							{
								type: 'hw.device-type',
								slug: 'artik10',
							},
							{
								type: 'hw.device-type',
								slug: 'raspberry-pi',
							},
						],
					},
				],
			}),
			new Contract({
				type: 'hw.device-type',
				slug: 'artik10',
				name: 'Samsung Artik 10',
				requires: [
					{
						type: 'arch.sw',
						slug: 'amd64',
					},
				],
			}),
			new Contract({
				type: 'arch.sw',
				slug: 'armv7hf',
				name: 'armv7hf',
			}),
		]);

		expect(contract.areChildrenSatisfied()).to.be.false;
	});

	it('should return false given a requirement over a contract that does not exist', () => {
		const contract = new Contract({
			type: 'foo',
			bar: 'bar',
		});

		contract.addChildren([
			new Contract({
				type: 'sw.os',
				name: 'Debian',
				slug: 'debian',
				requires: [
					{
						type: 'hw.device-type',
						slug: 'artik10',
					},
				],
			}),
		]);

		expect(contract.areChildrenSatisfied()).to.be.false;
	});

	it(
		'should return true given a requirement over a contract that does not ' +
			'exist for which the type was not passed',
		() => {
			const contract = new Contract({
				type: 'foo',
				bar: 'bar',
			});

			contract.addChildren([
				new Contract({
					type: 'sw.os',
					name: 'Debian',
					slug: 'debian',
					requires: [
						{
							type: 'hw.device-type',
							slug: 'artik10',
						},
					],
				}),
			]);

			expect(
				contract.areChildrenSatisfied({
					types: new Set(['arch.sw']),
				}),
			).to.be.true;
		},
	);

	it('should return true given one satisfied type in a satisfied context', () => {
		const contract = new Contract({
			type: 'foo',
			bar: 'bar',
		});

		contract.addChildren([
			new Contract({
				type: 'sw.os',
				name: 'Debian',
				slug: 'debian',
				requires: [
					{
						or: [
							{
								type: 'hw.device-type',
								slug: 'artik10',
							},
							{
								type: 'hw.device-type',
								slug: 'raspberry-pi',
							},
						],
					},
				],
			}),
			new Contract({
				type: 'hw.device-type',
				slug: 'artik10',
				name: 'Samsung Artik 10',
				requires: [
					{
						type: 'arch.sw',
						slug: 'armv7hf',
					},
				],
			}),
			new Contract({
				type: 'arch.sw',
				slug: 'armv7hf',
				name: 'armv7hf',
			}),
		]);

		expect(
			contract.areChildrenSatisfied({
				types: new Set(['hw.device-type']),
			}),
		).to.be.true;
	});

	it('should return true given one satisfied type in an unsatisfied context', () => {
		const contract = new Contract({
			type: 'foo',
			bar: 'bar',
		});

		contract.addChildren([
			new Contract({
				type: 'sw.os',
				name: 'Debian',
				slug: 'debian',
				requires: [
					{
						or: [
							{
								type: 'hw.device-type',
								slug: 'intel-edison',
							},
							{
								type: 'hw.device-type',
								slug: 'raspberry-pi',
							},
						],
					},
				],
			}),
			new Contract({
				type: 'hw.device-type',
				slug: 'artik10',
				name: 'Samsung Artik 10',
				requires: [
					{
						type: 'arch.sw',
						slug: 'armv7hf',
					},
				],
			}),
			new Contract({
				type: 'arch.sw',
				slug: 'armv7hf',
				name: 'armv7hf',
			}),
		]);

		expect(
			contract.areChildrenSatisfied({
				types: new Set(['arch.sw']),
			}),
		).to.be.true;
	});

	it('should return true given one unknown type in an unsatisfied context', () => {
		const contract = new Contract({
			type: 'foo',
			bar: 'bar',
		});

		contract.addChildren([
			new Contract({
				type: 'sw.os',
				name: 'Debian',
				slug: 'debian',
				requires: [
					{
						or: [
							{
								type: 'hw.device-type',
								slug: 'intel-edison',
							},
							{
								type: 'hw.device-type',
								slug: 'raspberry-pi',
							},
						],
					},
				],
			}),
			new Contract({
				type: 'hw.device-type',
				slug: 'artik10',
				name: 'Samsung Artik 10',
				requires: [
					{
						type: 'arch.sw',
						slug: 'armv7hf',
					},
				],
			}),
			new Contract({
				type: 'arch.sw',
				slug: 'armv7hf',
				name: 'armv7hf',
			}),
		]);

		expect(
			contract.areChildrenSatisfied({
				types: new Set(['foo']),
			}),
		).to.be.true;
	});

	it('should return false given one unsatisfied type in an unsatisfied context', () => {
		const contract = new Contract({
			type: 'foo',
			bar: 'bar',
		});

		contract.addChildren([
			new Contract({
				type: 'sw.os',
				name: 'Debian',
				slug: 'debian',
				requires: [
					{
						or: [
							{
								type: 'hw.device-type',
								slug: 'intel-edison',
							},
							{
								type: 'hw.device-type',
								slug: 'raspberry-pi',
							},
						],
					},
				],
			}),
			new Contract({
				type: 'hw.device-type',
				slug: 'artik10',
				name: 'Samsung Artik 10',
				requires: [
					{
						type: 'arch.sw',
						slug: 'armv7hf',
					},
				],
			}),
			new Contract({
				type: 'arch.sw',
				slug: 'armv7hf',
				name: 'armv7hf',
			}),
		]);

		expect(
			contract.areChildrenSatisfied({
				types: new Set(['hw.device-type']),
			}),
		).to.be.false;
	});

	it('should return false given one unsatisfied and one satisfied type in an unsatisfied context', () => {
		const contract = new Contract({
			type: 'foo',
			bar: 'bar',
		});

		contract.addChildren([
			new Contract({
				type: 'sw.os',
				name: 'Debian',
				slug: 'debian',
				requires: [
					{
						or: [
							{
								type: 'hw.device-type',
								slug: 'intel-edison',
							},
							{
								type: 'hw.device-type',
								slug: 'raspberry-pi',
							},
						],
					},
				],
			}),
			new Contract({
				type: 'hw.device-type',
				slug: 'artik10',
				name: 'Samsung Artik 10',
				requires: [
					{
						type: 'arch.sw',
						slug: 'armv7hf',
					},
				],
			}),
			new Contract({
				type: 'arch.sw',
				slug: 'armv7hf',
				name: 'armv7hf',
			}),
		]);

		expect(
			contract.areChildrenSatisfied({
				types: new Set(['arch.sw', 'hw.device-type']),
			}),
		).to.be.false;
	});

	it('should return true given two satisfied types in a satisfied context', () => {
		const contract = new Contract({
			type: 'foo',
			bar: 'bar',
		});

		contract.addChildren([
			new Contract({
				type: 'sw.os',
				name: 'Debian',
				slug: 'debian',
				requires: [
					{
						or: [
							{
								type: 'hw.device-type',
								slug: 'artik10',
							},
							{
								type: 'hw.device-type',
								slug: 'raspberry-pi',
							},
						],
					},
				],
			}),
			new Contract({
				type: 'hw.device-type',
				slug: 'artik10',
				name: 'Samsung Artik 10',
				requires: [
					{
						type: 'arch.sw',
						slug: 'armv7hf',
					},
				],
			}),
			new Contract({
				type: 'arch.sw',
				slug: 'armv7hf',
				name: 'armv7hf',
			}),
		]);

		expect(
			contract.areChildrenSatisfied({
				types: new Set(['arch.sw', 'hw.device-type']),
			}),
		).to.be.true;
	});

	it('should return true given a context with other satisfied contexts', () => {
		const container = new Contract({
			type: 'foo',
			bar: 'bar',
		});

		const contract1 = new Contract({
			type: 'child',
			slug: 'child-1',
		});

		const contract2 = new Contract({
			type: 'child',
			slug: 'child-2',
		});

		const contract3 = new Contract({
			type: 'child',
			slug: 'child-3',
		});

		contract1.addChild(
			new Contract({
				type: 'sw.os',
				name: 'Debian',
				slug: 'debian',
				requires: [
					{
						type: 'hw.device-type',
						slug: 'artik10',
					},
				],
			}),
		);

		contract2.addChild(
			new Contract({
				type: 'hw.device-type',
				slug: 'artik10',
				name: 'Samsung Artik 10',
				requires: [
					{
						type: 'arch.sw',
						slug: 'armv7hf',
					},
				],
			}),
		);

		contract3.addChild(
			new Contract({
				type: 'arch.sw',
				slug: 'armv7hf',
				name: 'armv7hf',
			}),
		);

		container.addChildren([contract1, contract2, contract3]);
		expect(container.areChildrenSatisfied()).to.be.true;
	});

	it('should return false given a context with unsatisfied contexts', () => {
		const container = new Contract({
			type: 'foo',
			bar: 'bar',
		});

		const contract1 = new Contract({
			type: 'child',
			slug: 'child-1',
		});

		const contract2 = new Contract({
			type: 'child',
			slug: 'child-2',
		});

		const contract3 = new Contract({
			type: 'child',
			slug: 'child-3',
		});

		contract1.addChild(
			new Contract({
				type: 'sw.os',
				name: 'Debian',
				slug: 'debian',
				requires: [
					{
						type: 'hw.device-type',
						slug: 'artik10',
					},
				],
			}),
		);

		contract2.addChild(
			new Contract({
				type: 'hw.device-type',
				slug: 'artik10',
				name: 'Samsung Artik 10',
				requires: [
					{
						type: 'arch.sw',
						slug: 'armv7hf',
					},
				],
			}),
		);

		contract3.addChild(
			new Contract({
				type: 'arch.sw',
				slug: 'armel',
				name: 'armel',
			}),
		);

		container.addChildren([contract1, contract2, contract3]);
		expect(container.areChildrenSatisfied()).to.be.false;
	});
});
