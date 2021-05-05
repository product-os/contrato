/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { expect } from '../../chai';

import Contract from '../../../lib/contract';

describe('Contract templates', () => {
	it('should resolve templates for which the values exist', () => {
		const contract = new Contract({
			type: 'arch.sw',
			version: '7',
			name: 'ARM v{{this.version}}',
			slug: 'armv7hf',
		});

		expect(contract.metadata.hash).to.equal(
			'0765760c9fefb5bacd69d5d58bfaaab931a75d25',
		);

		expect(contract.raw).to.deep.equal({
			type: 'arch.sw',
			version: '7',
			name: 'ARM v7',
			slug: 'armv7hf',
		});
	});

	it('should not resolve templates for which the values do not exist', () => {
		const contract = new Contract({
			type: 'arch.sw',
			name: '{{this.displayName}}',
			slug: 'armv7hf',
		});

		expect(contract.metadata.hash).to.equal(
			'9c847d98c15460b417934b5185bb39c316a1386a',
		);

		expect(contract.raw).to.deep.equal({
			type: 'arch.sw',
			name: '{{this.displayName}}',
			slug: 'armv7hf',
		});
	});

	it('should not hash a templated contract if the hash option is false', () => {
		const contract = new Contract(
			{
				type: 'arch.sw',
				version: '7',
				name: 'ARM v{{this.version}}',
				slug: 'armv7hf',
			},
			{
				hash: false,
			},
		);

		expect(typeof contract.metadata.hash).to.equal('undefined');

		expect(contract.raw).to.deep.equal({
			type: 'arch.sw',
			version: '7',
			name: 'ARM v7',
			slug: 'armv7hf',
		});
	});
});
