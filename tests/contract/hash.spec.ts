/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { expect } from '../chai';

import Contract from '../../lib/contract';

describe('Contract hash', () => {
	it('should be able to re-hash a mutated contract', () => {
		const contract = new Contract({
			type: 'arch.sw',
			name: 'armv7hf',
			slug: 'armv7hf',
		});

		expect(contract.metadata.hash).to.equal(
			'e3d3b7f2e5820db4b45975380a3f467bc2ff2999',
		);
		contract.raw.name = 'ARM v7';
		contract.hash();
		expect(contract.metadata.hash).to.equal(
			'3408d9c3746f9cc45e4c4d1b83b65d0239fbd346',
		);
	});

	it('should not re-hash metadata changes', () => {
		const contract = new Contract({
			type: 'arch.sw',
			name: 'armv7hf',
			slug: 'armv7hf',
		});

		contract.metadata.foo = 'bar';
		contract.hash();
		expect(contract.metadata.hash).to.equal(
			'e3d3b7f2e5820db4b45975380a3f467bc2ff2999',
		);

		contract.metadata.foo = 'baz';
		contract.hash();
		expect(contract.metadata.hash).to.equal(
			'e3d3b7f2e5820db4b45975380a3f467bc2ff2999',
		);
	});
});
