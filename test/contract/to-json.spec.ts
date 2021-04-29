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
import CONTRACTS from '../contracts.json';

test('should convert a contract into a JSON object', (test) => {
	const source = CONTRACTS['sw.os'].debian.wheezy.object
	const contract = new Contract(source)
	test.deepEqual(contract.toJSON(), source)
})

test('should handle a contract with one child', (test) => {
	const container = new Contract({
		type: 'foo',
		slug: 'bar'
	})

	container.addChild(new Contract(CONTRACTS['sw.os'].debian.wheezy.object))

	test.deepEqual(container.toJSON(), {
		type: 'foo',
		slug: 'bar',
		children: {
			sw: {
				os: CONTRACTS['sw.os'].debian.wheezy.object
			}
		}
	})
})

test('should handle a contract with two children of the same type and slug', (test) => {
	const container = new Contract({
		type: 'foo',
		slug: 'bar'
	})

	container.addChildren([
		new Contract(CONTRACTS['sw.os'].debian.wheezy.object),
		new Contract(CONTRACTS['sw.os'].debian.jessie.object)
	])

	test.deepEqual(container.toJSON(), {
		type: 'foo',
		slug: 'bar',
		children: {
			sw: {
				os: {
					debian: [
						CONTRACTS['sw.os'].debian.wheezy.object,
						CONTRACTS['sw.os'].debian.jessie.object
					]
				}
			}
		}
	})
})

test('should handle a contract with two children of the same type but different slugs', (test) => {
	const container = new Contract({
		type: 'foo',
		slug: 'bar'
	})

	container.addChildren([
		new Contract(CONTRACTS['sw.os'].debian.wheezy.object),
		new Contract(CONTRACTS['sw.os'].fedora['25'].object)
	])

	test.deepEqual(container.toJSON(), {
		type: 'foo',
		slug: 'bar',
		children: {
			sw: {
				os: {
					debian: CONTRACTS['sw.os'].debian.wheezy.object,
					fedora: CONTRACTS['sw.os'].fedora['25'].object
				}
			}
		}
	})
})

test('should handle a contract with two children of different types', (test) => {
	const container = new Contract({
		type: 'foo',
		slug: 'bar'
	})

	container.addChildren([
		new Contract(CONTRACTS['sw.os'].debian.wheezy.object),
		new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object)
	])

	test.deepEqual(container.toJSON(), {
		type: 'foo',
		slug: 'bar',
		children: {
			sw: {
				os: CONTRACTS['sw.os'].debian.wheezy.object,
				blob: CONTRACTS['sw.blob'].nodejs['4.8.0'].object
			}
		}
	})
})

test('should not expand one child with aliases', (test) => {
	const contract1 = new Contract({
		type: 'hw.device-type',
		name: 'Raspberry Pi',
		slug: 'raspberrypi',
		aliases: [ 'raspberry-pi', 'rpi' ]
	})

	const container = new Contract({
		type: 'foo',
		slug: 'bar'
	})

	container.addChild(contract1)

	test.deepEqual(container.toJSON(), {
		type: 'foo',
		slug: 'bar',
		children: {
			hw: {
				'device-type': contract1.raw
			}
		}
	})

	test.deepEqual(new Contract(container.toJSON()), container)
})

test('should expand aliases in two children of the same type', (test) => {
	const contract1 = new Contract({
		type: 'hw.device-type',
		name: 'Raspberry Pi',
		slug: 'raspberrypi',
		aliases: [ 'raspberry-pi', 'rpi' ]
	})

	const contract2 = new Contract({
		type: 'hw.device-type',
		name: 'Intel NUC',
		slug: 'intel-nuc',
		aliases: [ 'nuc' ]
	})

	const container = new Contract({
		type: 'foo',
		slug: 'bar'
	})

	container.addChildren([ contract1, contract2 ])

	test.deepEqual(container.toJSON(), {
		type: 'foo',
		slug: 'bar',
		children: {
			hw: {
				'device-type': {
					raspberrypi: contract1.raw,
					rpi: contract1.raw,
					'raspberry-pi': contract1.raw,
					'intel-nuc': contract2.raw,
					nuc: contract2.raw
				}
			}
		}
	})

	test.deepEqual(new Contract(container.toJSON()), container)
})

test('should correctly handle one aliased and one non aliased child of the same type', (test) => {
	const contract1 = new Contract({
		type: 'hw.device-type',
		name: 'Raspberry Pi',
		slug: 'raspberrypi',
		aliases: [ 'raspberry-pi', 'rpi' ]
	})

	const contract2 = new Contract({
		type: 'hw.device-type',
		name: 'Intel NUC',
		slug: 'intel-nuc'
	})

	const container = new Contract({
		type: 'foo',
		slug: 'bar'
	})

	container.addChildren([ contract1, contract2 ])

	test.deepEqual(container.toJSON(), {
		type: 'foo',
		slug: 'bar',
		children: {
			hw: {
				'device-type': {
					raspberrypi: contract1.raw,
					rpi: contract1.raw,
					'raspberry-pi': contract1.raw,
					'intel-nuc': contract2.raw
				}
			}
		}
	})

	test.deepEqual(new Contract(container.toJSON()), container)
})

test('should correctly handle one none aliased and one aliased child of the same type', (test) => {
	const contract1 = new Contract({
		type: 'hw.device-type',
		name: 'Intel NUC',
		slug: 'intel-nuc'
	})

	const contract2 = new Contract({
		type: 'hw.device-type',
		name: 'Raspberry Pi',
		slug: 'raspberrypi',
		aliases: [ 'raspberry-pi', 'rpi' ]
	})

	const container = new Contract({
		type: 'foo',
		slug: 'bar'
	})

	container.addChildren([ contract1, contract2 ])

	test.deepEqual(container.toJSON(), {
		type: 'foo',
		slug: 'bar',
		children: {
			hw: {
				'device-type': {
					raspberrypi: contract2.raw,
					rpi: contract2.raw,
					'raspberry-pi': contract2.raw,
					'intel-nuc': contract1.raw
				}
			}
		}
	})

	test.deepEqual(new Contract(container.toJSON()), container)
})
