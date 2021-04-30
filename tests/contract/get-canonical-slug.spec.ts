/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { expect } from '../chai';

import Contract from '../../lib/contract';

describe('Contract getCanonicalSlug', () => {
	it('should return the canonical slug', () => {
		const contract = new Contract({
			type: 'arch.sw',
			name: 'armv7hf',
			slug: 'armv7hf',
			canonicalSlug: 'armhf',
		});

		expect(contract.getCanonicalSlug()).to.equal('armhf');
	});

	it('should return the slug if canonical slug does not exist', () => {
		const contract = new Contract({
			type: 'arch.sw',
			name: 'armv7hf',
			slug: 'armv7hf',
		});

		expect(contract.getCanonicalSlug()).to.equal('armv7hf');
	});
});
