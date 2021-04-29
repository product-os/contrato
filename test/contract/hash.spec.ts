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

import Contract from '../../lib/contract';

test('should be able to re-hash a mutated contract', (test) => {
	const contract = new Contract({
		type: 'arch.sw',
		name: 'armv7hf',
		slug: 'armv7hf'
	})

	test.is(contract.metadata.hash, 'e3d3b7f2e5820db4b45975380a3f467bc2ff2999')
	contract.raw.name = 'ARM v7'
	contract.hash()
	test.is(contract.metadata.hash, '3408d9c3746f9cc45e4c4d1b83b65d0239fbd346')
})

test('should not re-hash metadata changes', (test) => {
	const contract = new Contract({
		type: 'arch.sw',
		name: 'armv7hf',
		slug: 'armv7hf'
	})

	contract.metadata.foo = 'bar'
	contract.hash()
	test.is(contract.metadata.hash, 'e3d3b7f2e5820db4b45975380a3f467bc2ff2999')

	contract.metadata.foo = 'baz'
	contract.hash()
	test.is(contract.metadata.hash, 'e3d3b7f2e5820db4b45975380a3f467bc2ff2999')
})
