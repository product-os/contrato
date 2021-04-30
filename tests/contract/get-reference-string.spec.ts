/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { expect } from '../chai';

import Contract from '../../lib/contract';

describe('Contract getReferenceString', () => {
	it('should return the reference string of a contract without a version', () => {
		const contract = new Contract({
			type: 'sw.arch',
			slug: 'armv7hf',
			name: 'ARMV7HF',
		});

		expect(contract.getReferenceString()).to.equal('armv7hf');
	});

	it('should return the reference string of a contract with a version', () => {
		const contract = new Contract({
			type: 'sw.os',
			slug: 'debian',
			version: 'wheezy',
			name: 'Debian Wheezy',
		});

		expect(contract.getReferenceString()).to.equal('debian@wheezy');
	});
});
