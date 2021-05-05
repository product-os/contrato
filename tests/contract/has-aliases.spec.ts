/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { expect } from '../chai';

import Contract from '../../lib/contract';

describe('Contract hasAliases', () => {
	it('should return false given a contract without aliases', () => {
		const contract = new Contract({
			type: 'arch.sw',
			name: 'armv7hf',
			slug: 'armv7hf',
		});

		expect(contract.hasAliases()).to.be.false;
	});

	it('should return true given a contract with aliases', () => {
		const contract = new Contract({
			type: 'hw.device-type',
			name: 'Raspberry Pi',
			slug: 'raspberrypi',
			aliases: ['rpi', 'raspberry-pi'],
		});

		expect(contract.hasAliases()).to.be.true;
	});

	it('should return false given a contract with empty aliases', () => {
		const contract = new Contract({
			type: 'arch.sw',
			name: 'armv7hf',
			slug: 'armv7hf',
			aliases: [],
		});

		expect(contract.hasAliases()).to.be.false;
	});
});
