/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { expect } from '../chai';
import { findPartial } from '../../lib/partials';

import Contract from '../../lib/contract';

describe('findPartial', () => {
	it('should find a partial in a one level structure with one contract of a type', () => {
		const contract = new Contract({
			type: 'foo',
			slug: 'bar',
		});

		contract.addChildren([
			new Contract({
				type: 'arch.sw',
				name: 'armv7hf',
				slug: 'armv7hf',
			}),
		]);

		expect(
			findPartial('my-partial', contract, {
				baseDirectory: 'path/to/partials',
				structure: ['arch.sw'],
			}),
		).to.deep.equal([
			'path/to/partials/armv7hf/my-partial.tpl',
			'path/to/partials/my-partial.tpl',
		]);
	});

	it('should find a partial in a one level structure with one alias contract of a type', () => {
		const contract = new Contract({
			type: 'foo',
			slug: 'bar',
		});

		contract.addChildren([
			new Contract({
				type: 'arch.sw',
				name: 'armv7hf',
				slug: 'armhf',
				canonicalSlug: 'armv7hf',
			}),
		]);

		expect(
			findPartial('my-partial', contract, {
				baseDirectory: 'path/to/partials',
				structure: ['arch.sw'],
			}),
		).to.deep.equal([
			'path/to/partials/armv7hf/my-partial.tpl',
			'path/to/partials/my-partial.tpl',
		]);
	});

	it('should find a partial in a one level structure with two alias contracts of a type', () => {
		const contract = new Contract({
			type: 'foo',
			slug: 'bar',
		});

		contract.addChildren([
			new Contract({
				type: 'arch.sw',
				name: 'armv7hf',
				slug: 'armhf',
				canonicalSlug: 'armv7hf',
			}),
			new Contract({
				type: 'arch.sw',
				name: 'armel',
				slug: 'armv5e',
				canonicalSlug: 'armel',
			}),
		]);

		expect(
			findPartial('my-partial', contract, {
				baseDirectory: 'path/to/partials',
				structure: ['arch.sw'],
			}),
		).to.deep.equal([
			'path/to/partials/armel+armv7hf/my-partial.tpl',
			'path/to/partials/my-partial.tpl',
		]);
	});

	it('should find a partial in a one level structure with two contracts of a type with one right version', () => {
		const contract = new Contract({
			type: 'foo',
			slug: 'bar',
		});

		contract.addChildren([
			new Contract({
				type: 'arch.sw',
				version: '3',
				name: 'armv7hf',
				slug: 'armv7hf',
			}),
			new Contract({
				type: 'arch.sw',
				name: 'armel',
				slug: 'armel',
			}),
		]);

		expect(
			findPartial('my-partial', contract, {
				baseDirectory: 'path/to/partials',
				structure: ['arch.sw'],
			}),
		).to.deep.equal([
			'path/to/partials/armel+armv7hf@3/my-partial.tpl',
			'path/to/partials/armel+armv7hf/my-partial.tpl',
			'path/to/partials/my-partial.tpl',
		]);
	});

	it('should find a partial in a one level structure with two contracts of a type with one right alias', () => {
		const contract = new Contract({
			type: 'foo',
			slug: 'bar',
		});

		contract.addChildren([
			new Contract({
				type: 'arch.sw',
				version: '3',
				name: 'armv7hf',
				slug: 'armhf',
				canonicalSlug: 'armv7hf',
			}),
			new Contract({
				type: 'arch.sw',
				name: 'armel',
				slug: 'armel',
			}),
		]);

		expect(
			findPartial('my-partial', contract, {
				baseDirectory: 'path/to/partials',
				structure: ['arch.sw'],
			}),
		).to.deep.equal([
			'path/to/partials/armel+armv7hf@3/my-partial.tpl',
			'path/to/partials/armel+armv7hf/my-partial.tpl',
			'path/to/partials/my-partial.tpl',
		]);
	});

	it('should find a partial in a one level structure with two contracts of a type with one left version', () => {
		const contract = new Contract({
			type: 'foo',
			slug: 'bar',
		});

		contract.addChildren([
			new Contract({
				type: 'arch.sw',
				name: 'armv7hf',
				slug: 'armv7hf',
			}),
			new Contract({
				type: 'arch.sw',
				version: '3',
				name: 'armel',
				slug: 'armel',
			}),
		]);

		expect(
			findPartial('my-partial', contract, {
				baseDirectory: 'path/to/partials',
				structure: ['arch.sw'],
			}),
		).to.deep.equal([
			'path/to/partials/armel@3+armv7hf/my-partial.tpl',
			'path/to/partials/armel+armv7hf/my-partial.tpl',
			'path/to/partials/my-partial.tpl',
		]);
	});

	it('should find a partial in a one level structure with two contracts of a type with one left alias', () => {
		const contract = new Contract({
			type: 'foo',
			slug: 'bar',
		});

		contract.addChildren([
			new Contract({
				type: 'arch.sw',
				name: 'armv7hf',
				slug: 'armhf',
				canonicalSlug: 'armv7hf',
			}),
			new Contract({
				type: 'arch.sw',
				version: '3',
				name: 'armel',
				slug: 'armel',
			}),
		]);

		expect(
			findPartial('my-partial', contract, {
				baseDirectory: 'path/to/partials',
				structure: ['arch.sw'],
			}),
		).to.deep.equal([
			'path/to/partials/armel@3+armv7hf/my-partial.tpl',
			'path/to/partials/armel+armv7hf/my-partial.tpl',
			'path/to/partials/my-partial.tpl',
		]);
	});

	it('should find a partial in a one level structure with two contracts of a type with two versions', () => {
		const contract = new Contract({
			type: 'foo',
			slug: 'bar',
		});

		contract.addChildren([
			new Contract({
				type: 'arch.sw',
				version: '1',
				name: 'armv7hf',
				slug: 'armv7hf',
			}),
			new Contract({
				type: 'arch.sw',
				version: '3',
				name: 'armel',
				slug: 'armel',
			}),
		]);

		expect(
			findPartial('my-partial', contract, {
				baseDirectory: 'path/to/partials',
				structure: ['arch.sw'],
			}),
		).to.deep.equal([
			'path/to/partials/armel@3+armv7hf@1/my-partial.tpl',
			'path/to/partials/armel+armv7hf/my-partial.tpl',
			'path/to/partials/my-partial.tpl',
		]);
	});

	it('should find a partial in a one level structure with one contract of a type with a version', () => {
		const contract = new Contract({
			type: 'foo',
			slug: 'bar',
		});

		contract.addChildren([
			new Contract({
				type: 'arch.sw',
				name: 'armv7hf',
				version: '3',
				slug: 'armv7hf',
			}),
		]);

		expect(
			findPartial('my-partial', contract, {
				baseDirectory: 'path/to/partials',
				structure: ['arch.sw'],
			}),
		).to.deep.equal([
			'path/to/partials/armv7hf@3/my-partial.tpl',
			'path/to/partials/armv7hf/my-partial.tpl',
			'path/to/partials/my-partial.tpl',
		]);
	});

	it('should find a partial in a two level structure with one contract of each type', () => {
		const contract = new Contract({
			type: 'foo',
			slug: 'bar',
		});

		contract.addChildren([
			new Contract({
				type: 'arch.sw',
				name: 'armv7hf',
				slug: 'armv7hf',
			}),
			new Contract({
				type: 'hw.device-type',
				name: 'Raspberry Pi 3',
				slug: 'raspberrypi3',
			}),
		]);

		expect(
			findPartial('my-partial', contract, {
				baseDirectory: 'path/to/partials',
				structure: ['hw.device-type', 'arch.sw'],
			}),
		).to.deep.equal([
			'path/to/partials/raspberrypi3+armv7hf/my-partial.tpl',
			'path/to/partials/raspberrypi3/my-partial.tpl',
			'path/to/partials/my-partial.tpl',
		]);
	});

	it('should find a partial in a two level structure with one contract of each type with versions', () => {
		const contract = new Contract({
			type: 'foo',
			slug: 'bar',
		});

		contract.addChildren([
			new Contract({
				type: 'arch.sw',
				version: '1',
				name: 'armv7hf',
				slug: 'armv7hf',
			}),
			new Contract({
				type: 'hw.device-type',
				name: 'Raspberry Pi 3',
				version: 'rev1',
				slug: 'raspberrypi3',
			}),
		]);

		expect(
			findPartial('my-partial', contract, {
				baseDirectory: 'path/to/partials',
				structure: ['hw.device-type', 'arch.sw'],
			}),
		).to.deep.equal([
			'path/to/partials/raspberrypi3@rev1+armv7hf@1/my-partial.tpl',
			'path/to/partials/raspberrypi3@rev1+armv7hf/my-partial.tpl',
			'path/to/partials/raspberrypi3+armv7hf@1/my-partial.tpl',
			'path/to/partials/raspberrypi3+armv7hf/my-partial.tpl',
			'path/to/partials/raspberrypi3@rev1/my-partial.tpl',
			'path/to/partials/raspberrypi3/my-partial.tpl',
			'path/to/partials/my-partial.tpl',
		]);
	});

	it('should find a partial in a three level structure with one contract of each type', () => {
		const contract = new Contract({
			type: 'foo',
			slug: 'bar',
		});

		contract.addChildren([
			new Contract({
				type: 'arch.sw',
				name: 'armv7hf',
				slug: 'armv7hf',
			}),
			new Contract({
				type: 'hw.device-type',
				name: 'Raspberry Pi 3',
				slug: 'raspberrypi3',
			}),
			new Contract({
				type: 'sw.os',
				name: 'Debian Wheezy',
				slug: 'debian',
			}),
		]);

		expect(
			findPartial('my-partial', contract, {
				baseDirectory: 'path/to/partials',
				structure: ['hw.device-type', 'sw.os', 'arch.sw'],
			}),
		).to.deep.equal([
			'path/to/partials/raspberrypi3+debian+armv7hf/my-partial.tpl',
			'path/to/partials/raspberrypi3+debian/my-partial.tpl',
			'path/to/partials/raspberrypi3/my-partial.tpl',
			'path/to/partials/my-partial.tpl',
		]);
	});

	it('should find a partial in a three level structure with one contract with version of each type', () => {
		const contract = new Contract({
			type: 'foo',
			slug: 'bar',
		});

		contract.addChildren([
			new Contract({
				type: 'arch.sw',
				name: 'armv7hf',
				slug: 'armv7hf',
				version: '1',
			}),
			new Contract({
				type: 'hw.device-type',
				name: 'Raspberry Pi 3',
				slug: 'raspberrypi3',
				version: 'rev1',
			}),
			new Contract({
				type: 'sw.os',
				name: 'Debian Wheezy',
				slug: 'debian',
				version: '7',
			}),
		]);

		expect(
			findPartial('my-partial', contract, {
				baseDirectory: 'path/to/partials',
				structure: ['hw.device-type', 'sw.os', 'arch.sw'],
			}),
		).to.deep.equal([
			'path/to/partials/raspberrypi3@rev1+debian@7+armv7hf@1/my-partial.tpl',
			'path/to/partials/raspberrypi3@rev1+debian@7+armv7hf/my-partial.tpl',
			'path/to/partials/raspberrypi3@rev1+debian+armv7hf@1/my-partial.tpl',
			'path/to/partials/raspberrypi3@rev1+debian+armv7hf/my-partial.tpl',
			'path/to/partials/raspberrypi3+debian@7+armv7hf@1/my-partial.tpl',
			'path/to/partials/raspberrypi3+debian@7+armv7hf/my-partial.tpl',
			'path/to/partials/raspberrypi3+debian+armv7hf@1/my-partial.tpl',
			'path/to/partials/raspberrypi3+debian+armv7hf/my-partial.tpl',
			'path/to/partials/raspberrypi3@rev1+debian@7/my-partial.tpl',
			'path/to/partials/raspberrypi3@rev1+debian/my-partial.tpl',
			'path/to/partials/raspberrypi3+debian@7/my-partial.tpl',
			'path/to/partials/raspberrypi3+debian/my-partial.tpl',
			'path/to/partials/raspberrypi3@rev1/my-partial.tpl',
			'path/to/partials/raspberrypi3/my-partial.tpl',
			'path/to/partials/my-partial.tpl',
		]);
	});
});
