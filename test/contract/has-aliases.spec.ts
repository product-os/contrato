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

test('should return false given a contract without aliases', (test) => {
	const contract = new Contract({
		type: 'arch.sw',
		name: 'armv7hf',
		slug: 'armv7hf'
	})

	test.false(contract.hasAliases())
})

test('should return true given a contract with aliases', (test) => {
	const contract = new Contract({
		type: 'hw.device-type',
		name: 'Raspberry Pi',
		slug: 'raspberrypi',
		aliases: [ 'rpi', 'raspberry-pi' ]
	})

	test.true(contract.hasAliases())
})

test('should return false given a contract with empty aliases', (test) => {
	const contract = new Contract({
		type: 'arch.sw',
		name: 'armv7hf',
		slug: 'armv7hf',
		aliases: []
	})

	test.false(contract.hasAliases())
})
