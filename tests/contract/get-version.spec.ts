/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { expect } from '../chai';

import Contract from '../../lib/contract';

describe('Contract getVersion', () => {
	it('should return the version if there is one', () => {
		const contract = new Contract({
			type: 'sw.os',
			name: 'Debian Wheezy',
			version: 'wheezy',
			slug: 'debian',
		});

		expect(contract.getVersion()).to.equal('wheezy');
	});

	it('should return undefined if there is not one', () => {
		const contract = new Contract({
			type: 'sw.os',
			name: 'Debian Wheezy',
			slug: 'debian',
		});

		expect(contract.getVersion()).to.equal(undefined);
	});
});
