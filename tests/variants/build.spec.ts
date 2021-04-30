/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { expect } from '../chai';
import { build } from '../../lib/variants';

describe('build variants', () => {
	it('should build a contract with no variants', () => {
		expect(
			build({
				slug: 'debian',
				type: 'distro',
				name: 'Debian',
			}),
		).to.deep.equal([
			{
				slug: 'debian',
				type: 'distro',
				name: 'Debian',
			},
		]);
	});

	it('should build a contract with empty variants', () => {
		expect(
			build({
				slug: 'debian',
				type: 'distro',
				name: 'Debian',
				variants: [],
			}),
		).to.deep.equal([
			{
				slug: 'debian',
				type: 'distro',
				name: 'Debian',
			},
		]);
	});

	it('should build a contract with two variants', () => {
		expect(
			build({
				slug: 'nodejs_{{data.arch}}',
				type: 'blob',
				name: 'Node.js',
				data: {
					libc: 'musl-libc',
				},
				variants: [
					{
						data: {
							arch: 'amd64',
						},
						requires: [
							{
								type: 'arch.sw',
								slug: 'amd64',
							},
						],
					},
					{
						data: {
							arch: 'i386',
						},
						requires: [
							{
								type: 'arch.sw',
								slug: 'i386',
							},
						],
					},
				],
			}),
		).to.deep.equal([
			{
				slug: 'nodejs_{{data.arch}}',
				type: 'blob',
				name: 'Node.js',
				requires: [
					{
						type: 'arch.sw',
						slug: 'amd64',
					},
				],
				data: {
					arch: 'amd64',
					libc: 'musl-libc',
				},
			},
			{
				slug: 'nodejs_{{data.arch}}',
				type: 'blob',
				name: 'Node.js',
				requires: [
					{
						type: 'arch.sw',
						slug: 'i386',
					},
				],
				data: {
					arch: 'i386',
					libc: 'musl-libc',
				},
			},
		]);
	});

	it('should supported nested variants', () => {
		expect(
			build({
				slug: 'nodejs_{{data.arch}}',
				type: 'blob',
				name: 'Node.js',
				data: {
					libc: 'musl-libc',
				},
				variants: [
					{
						data: {
							arch: 'amd64',
						},
						requires: [
							{
								type: 'arch.sw',
								slug: 'amd64',
							},
						],
						variants: [
							{
								version: '6.3.0',
							},
							{
								version: '6.4.0',
							},
						],
					},
					{
						data: {
							arch: 'i386',
						},
						requires: [
							{
								type: 'arch.sw',
								slug: 'i386',
							},
						],
						variants: [
							{
								version: '6.3.0',
							},
						],
					},
				],
			}),
		).to.deep.equal([
			{
				slug: 'nodejs_{{data.arch}}',
				type: 'blob',
				version: '6.3.0',
				name: 'Node.js',
				requires: [
					{
						type: 'arch.sw',
						slug: 'amd64',
					},
				],
				data: {
					arch: 'amd64',
					libc: 'musl-libc',
				},
			},
			{
				slug: 'nodejs_{{data.arch}}',
				type: 'blob',
				version: '6.4.0',
				name: 'Node.js',
				requires: [
					{
						type: 'arch.sw',
						slug: 'amd64',
					},
				],
				data: {
					arch: 'amd64',
					libc: 'musl-libc',
				},
			},
			{
				slug: 'nodejs_{{data.arch}}',
				type: 'blob',
				version: '6.3.0',
				name: 'Node.js',
				requires: [
					{
						type: 'arch.sw',
						slug: 'i386',
					},
				],
				data: {
					arch: 'i386',
					libc: 'musl-libc',
				},
			},
		]);
	});

	it('should merge arrays correctly', () => {
		expect(
			build({
				slug: 'foo',
				type: 'blob',
				name: 'Foo',
				requires: [
					{
						type: 'bar',
						slug: 'baz',
					},
				],
				variants: [
					{
						requires: [
							{
								type: 'arch.sw',
								slug: 'amd64',
							},
						],
					},
					{
						requires: [
							{
								type: 'arch.sw',
								slug: 'i386',
							},
						],
					},
				],
			}),
		).to.deep.equal([
			{
				slug: 'foo',
				type: 'blob',
				name: 'Foo',
				requires: [
					{
						type: 'bar',
						slug: 'baz',
					},
					{
						type: 'arch.sw',
						slug: 'amd64',
					},
				],
			},
			{
				slug: 'foo',
				type: 'blob',
				name: 'Foo',
				requires: [
					{
						type: 'bar',
						slug: 'baz',
					},
					{
						type: 'arch.sw',
						slug: 'i386',
					},
				],
			},
		]);
	});
});
