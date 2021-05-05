/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { expect } from '../../chai';

import MatcherCache from '../../../lib/matcher-cache';
import Contract from '../../../lib/contract';

describe('Contract children', () => {
	it('should take a contract with a single child', () => {
		const contract = new Contract({
			type: 'misc.collection',
			slug: 'my-collection',
			children: {
				arch: {
					sw: {
						type: 'arch.sw',
						name: 'armv7hf',
						slug: 'armv7hf',
					},
				},
			},
		});

		expect(contract.metadata.children).to.deep.equal({
			typeMatchers: {},
			searchCache: new MatcherCache(),
			types: new Set(['arch.sw']),
			byType: {
				'arch.sw': new Set(['e3d3b7f2e5820db4b45975380a3f467bc2ff2999']),
			},
			byTypeSlug: {
				'arch.sw': {
					armv7hf: new Set(['e3d3b7f2e5820db4b45975380a3f467bc2ff2999']),
				},
			},
			map: {
				e3d3b7f2e5820db4b45975380a3f467bc2ff2999: new Contract({
					type: 'arch.sw',
					name: 'armv7hf',
					slug: 'armv7hf',
				}),
			},
		});

		expect(contract.raw).to.deep.equal({
			type: 'misc.collection',
			slug: 'my-collection',
			children: {
				arch: {
					sw: {
						type: 'arch.sw',
						name: 'armv7hf',
						slug: 'armv7hf',
					},
				},
			},
		});

		expect(new Contract(contract.raw)).to.deep.equal(contract);
	});

	it('should take a contract with two children of the same type', () => {
		const contract = new Contract({
			type: 'misc.collection',
			slug: 'my-collection',
			children: {
				arch: {
					sw: {
						armv7hf: {
							type: 'arch.sw',
							name: 'armv7hf',
							slug: 'armv7hf',
						},
						armel: {
							type: 'arch.sw',
							name: 'armel',
							slug: 'armel',
						},
					},
				},
			},
		});

		expect(contract.metadata.children).to.deep.equal({
			typeMatchers: {},
			searchCache: new MatcherCache(),
			types: new Set(['arch.sw']),
			byType: {
				'arch.sw': new Set([
					'e3d3b7f2e5820db4b45975380a3f467bc2ff2999',
					'6e26947f07bcacc28733ef81eea2d33579c5502e',
				]),
			},
			byTypeSlug: {
				'arch.sw': {
					armv7hf: new Set(['e3d3b7f2e5820db4b45975380a3f467bc2ff2999']),
					armel: new Set(['6e26947f07bcacc28733ef81eea2d33579c5502e']),
				},
			},
			map: {
				e3d3b7f2e5820db4b45975380a3f467bc2ff2999: new Contract({
					type: 'arch.sw',
					name: 'armv7hf',
					slug: 'armv7hf',
				}),
				'6e26947f07bcacc28733ef81eea2d33579c5502e': new Contract({
					type: 'arch.sw',
					name: 'armel',
					slug: 'armel',
				}),
			},
		});

		expect(contract.raw).to.deep.equal({
			type: 'misc.collection',
			slug: 'my-collection',
			children: {
				arch: {
					sw: {
						armv7hf: {
							type: 'arch.sw',
							name: 'armv7hf',
							slug: 'armv7hf',
						},
						armel: {
							type: 'arch.sw',
							name: 'armel',
							slug: 'armel',
						},
					},
				},
			},
		});

		expect(new Contract(contract.raw)).to.deep.equal(contract);
	});

	it('should take a contract with two children of the same type and slug', () => {
		const contract = new Contract({
			type: 'misc.collection',
			slug: 'my-collection',
			children: {
				sw: {
					distro: {
						debian: [
							{
								type: 'sw.distro',
								name: 'debian',
								version: 'wheezy',
								slug: 'debian',
							},
							{
								type: 'sw.distro',
								name: 'debian',
								version: 'jessie',
								slug: 'debian',
							},
						],
					},
				},
			},
		});

		expect(contract.metadata.children).to.deep.equal({
			typeMatchers: {},
			searchCache: new MatcherCache(),
			types: new Set(['sw.distro']),
			byType: {
				'sw.distro': new Set([
					'73adf497b1e8cde552e3be4eab317032f8dd65a0',
					'91c4f16ff328631011d49d2edc654cf3d9a36c75',
				]),
			},
			byTypeSlug: {
				'sw.distro': {
					debian: new Set([
						'73adf497b1e8cde552e3be4eab317032f8dd65a0',
						'91c4f16ff328631011d49d2edc654cf3d9a36c75',
					]),
				},
			},
			map: {
				'73adf497b1e8cde552e3be4eab317032f8dd65a0': new Contract({
					type: 'sw.distro',
					name: 'debian',
					version: 'wheezy',
					slug: 'debian',
				}),
				'91c4f16ff328631011d49d2edc654cf3d9a36c75': new Contract({
					type: 'sw.distro',
					name: 'debian',
					version: 'jessie',
					slug: 'debian',
				}),
			},
		});

		expect(contract.raw).to.deep.equal({
			type: 'misc.collection',
			slug: 'my-collection',
			children: {
				sw: {
					distro: {
						debian: [
							{
								type: 'sw.distro',
								name: 'debian',
								version: 'wheezy',
								slug: 'debian',
							},
							{
								type: 'sw.distro',
								name: 'debian',
								version: 'jessie',
								slug: 'debian',
							},
						],
					},
				},
			},
		});

		expect(new Contract(contract.raw)).to.deep.equal(contract);
	});

	it('should take a contract with two children of different types', () => {
		const contract = new Contract({
			type: 'misc.collection',
			slug: 'my-collection',
			children: {
				arch: {
					sw: {
						type: 'arch.sw',
						name: 'armv7hf',
						slug: 'armv7hf',
					},
				},
				sw: {
					distro: {
						type: 'sw.distro',
						name: 'debian',
						version: 'wheezy',
						slug: 'debian',
					},
				},
			},
		});

		expect(contract.metadata.children).to.deep.equal({
			typeMatchers: {},
			searchCache: new MatcherCache(),
			types: new Set(['arch.sw', 'sw.distro']),
			byType: {
				'arch.sw': new Set(['e3d3b7f2e5820db4b45975380a3f467bc2ff2999']),
				'sw.distro': new Set(['73adf497b1e8cde552e3be4eab317032f8dd65a0']),
			},
			byTypeSlug: {
				'arch.sw': {
					armv7hf: new Set(['e3d3b7f2e5820db4b45975380a3f467bc2ff2999']),
				},
				'sw.distro': {
					debian: new Set(['73adf497b1e8cde552e3be4eab317032f8dd65a0']),
				},
			},
			map: {
				e3d3b7f2e5820db4b45975380a3f467bc2ff2999: new Contract({
					type: 'arch.sw',
					name: 'armv7hf',
					slug: 'armv7hf',
				}),
				'73adf497b1e8cde552e3be4eab317032f8dd65a0': new Contract({
					type: 'sw.distro',
					name: 'debian',
					version: 'wheezy',
					slug: 'debian',
				}),
			},
		});

		expect(contract.raw).to.deep.equal({
			type: 'misc.collection',
			slug: 'my-collection',
			children: {
				arch: {
					sw: {
						type: 'arch.sw',
						name: 'armv7hf',
						slug: 'armv7hf',
					},
				},
				sw: {
					distro: {
						type: 'sw.distro',
						name: 'debian',
						version: 'wheezy',
						slug: 'debian',
					},
				},
			},
		});

		expect(new Contract(contract.raw)).to.deep.equal(contract);
	});
});
