/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { expect } from '../chai';

import Contract from '../../lib/contract';

describe('Contract getAllSlugs', () => {
	it('should return only the slug given a contract without aliases', () => {
		const contract = new Contract({
			type: 'arch.sw',
			name: 'armv7hf',
			slug: 'armv7hf',
		});

		expect(contract.getAllSlugs()).to.deep.equal(new Set(['armv7hf']));
	});

	it('should include the aliases if present', () => {
		const contract = new Contract({
			type: 'hw.device-type',
			name: 'Raspberry Pi',
			slug: 'raspberrypi',
			aliases: ['rpi', 'raspberry-pi'],
		});

		expect(contract.getAllSlugs()).to.deep.equal(
			new Set(['rpi', 'raspberry-pi', 'raspberrypi']),
		);
	});

	it('should return only the slug if aliases is empty', () => {
		const contract = new Contract({
			type: 'arch.sw',
			name: 'armv7hf',
			slug: 'armv7hf',
			aliases: [],
		});

		expect(contract.getAllSlugs()).to.deep.equal(new Set(['armv7hf']));
	});
});
