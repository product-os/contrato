/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { expect } from '../chai';

import Contract from '../../lib/contract';

describe('Contract interpolate', () => {
	it('should build missing templates', () => {
		const contract = new Contract({
			name: 'Debian {{this.data.codename}}',
			slug: 'debian',
			version: 'wheezy',
			type: 'sw.os',
			data: {
				url: 'https://contracts.org/downloads/{{this.type}}/{{this.slug}}/{{this.version}}.tar.gz',
			},
		});

		contract.raw.data.codename = 'Wheezy';
		contract.interpolate();

		expect(contract).to.deep.equal(
			new Contract({
				name: 'Debian Wheezy',
				slug: 'debian',
				version: 'wheezy',
				type: 'sw.os',
				data: {
					codename: 'Wheezy',
					url: 'https://contracts.org/downloads/sw.os/debian/wheezy.tar.gz',
				},
			}),
		);
	});

	it('should not rehash the contract if the rehash option is set to false', () => {
		const contract = new Contract({
			name: 'Debian {{this.data.codename}}',
			slug: 'debian',
			version: 'wheezy',
			type: 'sw.os',
			data: {
				url: 'https://contracts.org/downloads/{{this.type}}/{{this.slug}}/{{this.version}}.tar.gz',
			},
		});

		const hash = contract.metadata.hash;

		contract.raw.data.codename = 'Wheezy';
		contract.interpolate({
			rehash: false,
		});

		expect(contract.raw).to.deep.equal({
			name: 'Debian Wheezy',
			slug: 'debian',
			version: 'wheezy',
			type: 'sw.os',
			data: {
				codename: 'Wheezy',
				url: 'https://contracts.org/downloads/sw.os/debian/wheezy.tar.gz',
			},
		});

		expect(contract.metadata.hash).to.equal(hash);
	});

	it('should return the contract instance', () => {
		const contract = new Contract({
			name: 'Debian {{this.data.codename}}',
			slug: 'debian',
			version: 'wheezy',
			type: 'sw.os',
			data: {
				url: 'https://contracts.org/downloads/{{this.type}}/{{this.slug}}/{{this.version}}.tar.gz',
			},
		});

		expect(contract.interpolate()).to.deep.equal(contract);
	});

	it('should not perform interpolation on children', () => {
		const contract = new Contract({
			slug: 'debian',
			version: 'wheezy',
			type: 'sw.os',
			children: {
				foo: {
					bar: {
						slug: '{{this.version}}-child',
						type: 'foo.bar',
					},
				},
			},
		});

		expect(contract.interpolate().raw).to.deep.equal({
			slug: 'debian',
			version: 'wheezy',
			type: 'sw.os',
			children: {
				foo: {
					bar: {
						slug: '{{this.version}}-child',
						type: 'foo.bar',
					},
				},
			},
		});
	});
});
