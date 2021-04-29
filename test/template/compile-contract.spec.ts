/*
 * Copyright 2017 resin.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict'

import test from 'ava';
import { compileContract } from '../../lib/template';

test('should compile a contract without templates', (test) => {
	test.deepEqual(compileContract({
		type: 'distro',
		name: 'Debian',
		version: 'wheezy',
		slug: 'debian'
	}), {
		type: 'distro',
		name: 'Debian',
		version: 'wheezy',
		slug: 'debian'
	})
})

test('should compile a single top level template', (test) => {
	test.deepEqual(compileContract({
		type: 'distro',
		name: 'Debian {{this.version}}',
		version: 'wheezy',
		slug: 'debian'
	}), {
		type: 'distro',
		name: 'Debian wheezy',
		version: 'wheezy',
		slug: 'debian'
	})
})

test('should compile templates inside arrays', (test) => {
	test.deepEqual(compileContract({
		type: 'distro',
		name: 'Debian',
		slug: 'debian',
		random: [
			'{{this.name}}',
			'{{this.name}}',
			'{{this.name}}'
		],
		requires: [
			{
				name: '{{this.name}} ({{this.type}})'
			}
		]
	}), {
		type: 'distro',
		name: 'Debian',
		slug: 'debian',
		random: [
			'Debian',
			'Debian',
			'Debian'
		],
		requires: [
			{
				name: 'Debian (distro)'
			}
		]
	})
})

test('should compile multiple top level templates', (test) => {
	test.deepEqual(compileContract({
		type: 'distro',
		name: 'Debian {{this.version}}',
		version: 'wheezy',
		slug: 'debian-{{this.version}}'
	}), {
		type: 'distro',
		name: 'Debian wheezy',
		version: 'wheezy',
		slug: 'debian-wheezy'
	})
})

test('should compile a single nested template', (test) => {
	test.deepEqual(compileContract({
		type: 'distro',
		name: 'Debian',
		version: 'wheezy',
		slug: 'debian',
		data: {
			foo: {
				bar: {
					baz: '{{this.type}}'
				}
			}
		}
	}), {
		type: 'distro',
		name: 'Debian',
		version: 'wheezy',
		slug: 'debian',
		data: {
			foo: {
				bar: {
					baz: 'distro'
				}
			}
		}
	})
})

test('should leave missing values as interpolations', (test) => {
	test.deepEqual(compileContract({
		type: 'distro',
		name: 'Debian',
		version: '{{this.data.distroName}}',
		slug: 'debian'
	}), {
		type: 'distro',
		name: 'Debian',
		version: '{{this.data.distroName}}',
		slug: 'debian'
	})
})

test('should be able to blacklist a top level element', (test) => {
	const result = compileContract({
		type: 'distro',
		version: '7',
		name: 'Debian v{{this.version}}',
		data: {
			name: 'debian'
		},
		slug: '{{this.data.name}}'
	}, {
		blacklist: new Set([ 'name' ])
	})

	test.deepEqual(result, {
		type: 'distro',
		version: '7',
		name: 'Debian v{{this.version}}',
		data: {
			name: 'debian'
		},
		slug: 'debian'
	})
})

test('should be able to blacklist a nested element', (test) => {
	const result = compileContract({
		type: 'distro',
		version: '7',
		name: 'Debian v{{this.version}}',
		data: {
			name: 'debian',
			foo: {
				type: '{{this.type}}'
			}
		},
		slug: '{{this.data.name}}'
	}, {
		blacklist: new Set([ 'data.foo.type' ])
	})

	test.deepEqual(result, {
		type: 'distro',
		version: '7',
		name: 'Debian v7',
		data: {
			name: 'debian',
			foo: {
				type: '{{this.type}}'
			}
		},
		slug: 'debian'
	})
})

test('should be able to blacklist more than one element', (test) => {
	const result = compileContract({
		type: 'distro',
		version: '7',
		name: 'Debian v{{this.version}}',
		data: {
			name: 'debian',
			foo: {
				type: '{{this.type}}'
			}
		},
		slug: '{{this.data.name}}'
	}, {
		blacklist: new Set([ 'data.foo.type', 'name' ])
	})

	test.deepEqual(result, {
		type: 'distro',
		version: '7',
		name: 'Debian v{{this.version}}',
		data: {
			name: 'debian',
			foo: {
				type: '{{this.type}}'
			}
		},
		slug: 'debian'
	})
})

test('should be able to blacklist elements inside arrays', (test) => {
	const result = compileContract({
		slug: 'debian',
		type: 'distro',
		random: [
			'{{this.slug}}',
			'{{this.slug}}',
			'{{this.slug}}'
		]
	}, {
		blacklist: new Set([ 'random.1' ])
	})

	test.deepEqual(result, {
		slug: 'debian',
		type: 'distro',
		random: [
			'debian',
			'{{this.slug}}',
			'debian'
		]
	})
})

test('should be able to blacklist a whole subtree', (test) => {
	const result = compileContract({
		type: 'distro',
		version: '7',
		name: 'Debian v{{this.version}}',
		data: {
			name: 'debian',
			foo: {
				type: '{{this.type}}'
			}
		},
		slug: '{{this.data.name}}'
	}, {
		blacklist: new Set([ 'data' ])
	})

	test.deepEqual(result, {
		type: 'distro',
		version: '7',
		name: 'Debian v7',
		data: {
			name: 'debian',
			foo: {
				type: '{{this.type}}'
			}
		},
		slug: 'debian'
	})
})
