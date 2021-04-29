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

test('should throw if the type is not valid', (test) => {
	const container = new Contract({
		type: 'foo',
		slug: 'bar'
	})

	container.addChildren([
		new Contract(CONTRACTS['sw.os'].debian.wheezy.object),
		new Contract(CONTRACTS['sw.os'].debian.jessie.object)
	])

	test.throws(() => {
		container.getChildrenCombinations({
			type: 'foo',
			from: 2,
			to: 2
		})
	}, {
		message: 'Invalid cardinality: 2 to 2. The number of foo contracts in the universe is 0'
	})
})

test('should return combinations of cardinality 1 for one contract', (test) => {
	const container = new Contract({
		type: 'foo',
		slug: 'bar'
	})

	container.addChildren([
		new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object),
		new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
	])

	test.deepEqual(container.getChildrenCombinations({
		type: 'sw.os',
		from: 1,
		to: 1
	}), [
		[
			new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
		]
	])
})

test('should return combinations of cardinality 1 for two contracts', (test) => {
	const container = new Contract({
		type: 'foo',
		slug: 'bar'
	})

	container.addChildren([
		new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object),
		new Contract(CONTRACTS['sw.os'].debian.wheezy.object),
		new Contract(CONTRACTS['sw.os'].debian.jessie.object)
	])

	test.deepEqual(container.getChildrenCombinations({
		type: 'sw.os',
		from: 1,
		to: 1
	}), [
		[
			new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
		],
		[
			new Contract(CONTRACTS['sw.os'].debian.jessie.object)
		]
	])
})

test('should return combinations of cardinality 1 for three contracts', (test) => {
	const container = new Contract({
		type: 'foo',
		slug: 'bar'
	})

	container.addChildren([
		new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object),
		new Contract(CONTRACTS['sw.os'].debian.wheezy.object),
		new Contract(CONTRACTS['sw.os'].debian.jessie.object),
		new Contract(CONTRACTS['sw.os'].fedora['25'].object)
	])

	test.deepEqual(container.getChildrenCombinations({
		type: 'sw.os',
		from: 1,
		to: 1
	}), [
		[
			new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
		],
		[
			new Contract(CONTRACTS['sw.os'].debian.jessie.object)
		],
		[
			new Contract(CONTRACTS['sw.os'].fedora['25'].object)
		]
	])
})

test('should return combinations of cardinality 2 for two contracts', (test) => {
	const container = new Contract({
		type: 'foo',
		slug: 'bar'
	})

	container.addChildren([
		new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object),
		new Contract(CONTRACTS['sw.os'].debian.wheezy.object),
		new Contract(CONTRACTS['sw.os'].debian.jessie.object)
	])

	test.deepEqual(container.getChildrenCombinations({
		type: 'sw.os',
		from: 2,
		to: 2
	}), [
		[
			new Contract(CONTRACTS['sw.os'].debian.wheezy.object),
			new Contract(CONTRACTS['sw.os'].debian.jessie.object)
		]
	])
})

test('should return combinations of cardinality 2 for three contracts', (test) => {
	const container = new Contract({
		type: 'foo',
		slug: 'bar'
	})

	container.addChildren([
		new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object),
		new Contract(CONTRACTS['sw.os'].debian.wheezy.object),
		new Contract(CONTRACTS['sw.os'].debian.jessie.object),
		new Contract(CONTRACTS['sw.os'].fedora['25'].object)
	])

	test.deepEqual(container.getChildrenCombinations({
		type: 'sw.os',
		from: 2,
		to: 2
	}), [
		[
			new Contract(CONTRACTS['sw.os'].debian.wheezy.object),
			new Contract(CONTRACTS['sw.os'].debian.jessie.object)
		],
		[
			new Contract(CONTRACTS['sw.os'].debian.wheezy.object),
			new Contract(CONTRACTS['sw.os'].fedora['25'].object)
		],
		[
			new Contract(CONTRACTS['sw.os'].debian.jessie.object),
			new Contract(CONTRACTS['sw.os'].fedora['25'].object)
		]
	])
})

test('should throw if "from" is greater than "to"', (test) => {
	const container = new Contract({
		type: 'foo',
		slug: 'bar'
	})

	container.addChildren([
		new Contract(CONTRACTS['sw.os'].debian.wheezy.object),
		new Contract(CONTRACTS['sw.os'].debian.jessie.object)
	])

	test.throws(() => {
		container.getChildrenCombinations({
			type: 'sw.os',
			from: 2,
			to: 1
		})
	}, {
		message: 'Invalid cardinality: 2 to 1. The starting point is greater than the ending point'
	})
})

test('should generate combinations from 1 to 2 for one contract', (test) => {
	const container = new Contract({
		type: 'foo',
		slug: 'bar'
	})

	container.addChildren([
		new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object),
		new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
	])

	test.deepEqual(container.getChildrenCombinations({
		type: 'sw.os',
		from: 1,
		to: 2
	}), [
		[
			new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
		]
	])
})

test('should return combinations from 1 to 2 for two contracts', (test) => {
	const container = new Contract({
		type: 'foo',
		slug: 'bar'
	})

	container.addChildren([
		new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object),
		new Contract(CONTRACTS['sw.os'].debian.wheezy.object),
		new Contract(CONTRACTS['sw.os'].debian.jessie.object)
	])

	test.deepEqual(container.getChildrenCombinations({
		type: 'sw.os',
		from: 1,
		to: 2
	}), [
		[
			new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
		],
		[
			new Contract(CONTRACTS['sw.os'].debian.jessie.object)
		],
		[
			new Contract(CONTRACTS['sw.os'].debian.wheezy.object),
			new Contract(CONTRACTS['sw.os'].debian.jessie.object)
		]
	])
})

test('should return combinations from 1 to 3 for two contracts', (test) => {
	const container = new Contract({
		type: 'foo',
		slug: 'bar'
	})

	container.addChildren([
		new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object),
		new Contract(CONTRACTS['sw.os'].debian.wheezy.object),
		new Contract(CONTRACTS['sw.os'].debian.jessie.object)
	])

	test.deepEqual(container.getChildrenCombinations({
		type: 'sw.os',
		from: 1,
		to: 3
	}), [
		[
			new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
		],
		[
			new Contract(CONTRACTS['sw.os'].debian.jessie.object)
		],
		[
			new Contract(CONTRACTS['sw.os'].debian.wheezy.object),
			new Contract(CONTRACTS['sw.os'].debian.jessie.object)
		]
	])
})

test('should return combinations from 1 to 3 for three contracts', (test) => {
	const container = new Contract({
		type: 'foo',
		slug: 'bar'
	})

	container.addChildren([
		new Contract(CONTRACTS['sw.os'].fedora['25'].object),
		new Contract(CONTRACTS['sw.os'].debian.wheezy.object),
		new Contract(CONTRACTS['sw.os'].debian.jessie.object)
	])

	test.deepEqual(container.getChildrenCombinations({
		type: 'sw.os',
		from: 1,
		to: 3
	}), [
		[
			new Contract(CONTRACTS['sw.os'].fedora['25'].object)
		],
		[
			new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
		],
		[
			new Contract(CONTRACTS['sw.os'].debian.jessie.object)
		],
		[
			new Contract(CONTRACTS['sw.os'].fedora['25'].object),
			new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
		],
		[
			new Contract(CONTRACTS['sw.os'].fedora['25'].object),
			new Contract(CONTRACTS['sw.os'].debian.jessie.object)
		],
		[
			new Contract(CONTRACTS['sw.os'].debian.wheezy.object),
			new Contract(CONTRACTS['sw.os'].debian.jessie.object)
		],
		[
			new Contract(CONTRACTS['sw.os'].fedora['25'].object),
			new Contract(CONTRACTS['sw.os'].debian.wheezy.object),
			new Contract(CONTRACTS['sw.os'].debian.jessie.object)
		]
	])
})

test('should not consider aliases as separate contracts', (test) => {
	const contract1 = new Contract({
		type: 'hw.device-type',
		name: 'Raspberry Pi 2',
		slug: 'raspberrypi2',
		aliases: [ 'rpi2', 'raspberry-pi2' ]
	})

	const contract2 = new Contract({
		type: 'hw.device-type',
		name: 'Raspberry Pi',
		slug: 'raspberrypi',
		aliases: [ 'rpi', 'raspberry-pi' ]
	})

	const container = new Contract({
		type: 'foo',
		slug: 'bar'
	})

	container.addChildren([ contract1, contract2 ])

	test.deepEqual(container.getChildrenCombinations({
		type: 'hw.device-type',
		from: 1,
		to: 1
	}), [
		[ contract1 ],
		[ contract2 ]
	])
})
