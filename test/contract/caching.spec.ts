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

import MatcherCache from '../../lib/matcher-cache';
import Contract from '../../lib/contract';
import CONTRACTS from '../contracts.json';

test('should have an empty cache by default', (test) => {
	const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
	const contract2 = new Contract(CONTRACTS['sw.os'].debian.jessie.object)

	const container = new Contract({
		type: 'foo',
		slug: 'bar'
	})

	container.addChildren([ contract1, contract2 ])
	test.deepEqual(container.metadata.children.searchCache, new MatcherCache())
})

test('should create an entry after a successful search', (test) => {
	const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
	const contract2 = new Contract(CONTRACTS['sw.os'].fedora['25'].object)

	const container = new Contract({
		type: 'foo',
		slug: 'bar'
	})

	container.addChildren([ contract1, contract2 ])

	const matcher = Contract.createMatcher({
		type: 'sw.os',
		slug: 'debian'
	})

	container.findChildren(matcher)

	const cache = new MatcherCache()
	cache.add(matcher, [ contract1 ])

	test.deepEqual(container.metadata.children.searchCache, cache)
})

test('should be able to store multiple entries', (test) => {
	const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
	const contract2 = new Contract(CONTRACTS['sw.os'].fedora['25'].object)

	const container = new Contract({
		type: 'foo',
		slug: 'bar'
	})

	container.addChildren([ contract1, contract2 ])

	const matcher1 = Contract.createMatcher({
		type: 'sw.os',
		slug: 'debian'
	})

	const matcher2 = Contract.createMatcher({
		type: 'sw.os',
		slug: 'fedora'
	})

	container.findChildren(matcher1)
	container.findChildren(matcher2)

	const cache = new MatcherCache()
	cache.add(matcher1, [ contract1 ])
	cache.add(matcher2, [ contract2 ])

	test.deepEqual(container.metadata.children.searchCache, cache)
})

test('should still store an entry if there were no results', (test) => {
	const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
	const contract2 = new Contract(CONTRACTS['sw.os'].fedora['25'].object)

	const container = new Contract({
		type: 'foo',
		slug: 'bar'
	})

	container.addChildren([ contract1, contract2 ])

	const matcher = Contract.createMatcher({
		type: 'sw.os',
		slug: 'alpine'
	})

	container.findChildren(matcher)

	const cache = new MatcherCache()
	cache.add(matcher, [])

	test.deepEqual(container.metadata.children.searchCache, cache)
})

test('should honor a matcher over and over again', (test) => {
	const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
	const contract2 = new Contract(CONTRACTS['sw.os'].fedora['25'].object)

	const container = new Contract({
		type: 'foo',
		slug: 'bar'
	})

	container.addChildren([ contract1, contract2 ])

	const matcher = Contract.createMatcher({
		type: 'sw.os',
		slug: 'debian'
	})

	test.deepEqual(container.findChildren(matcher), [ contract1 ])
	test.deepEqual(container.findChildren(matcher), [ contract1 ])
	test.deepEqual(container.findChildren(matcher), [ contract1 ])
	test.deepEqual(container.findChildren(matcher), [ contract1 ])
})

test('should clear the cache for a certain type if a contract is added', (test) => {
	const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
	const contract2 = new Contract(CONTRACTS['sw.os'].fedora['25'].object)
	const contract3 = new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object)
	const contract4 = new Contract(CONTRACTS['hw.device-type'].artik10.object)
	const contract5 = new Contract(CONTRACTS['sw.os'].debian.jessie.object)

	const container = new Contract({
		type: 'foo',
		slug: 'bar'
	})

	container.addChildren([ contract1, contract2, contract3, contract4 ])

	const matcher1 = Contract.createMatcher({
		type: 'sw.os',
		slug: 'debian'
	})

	const matcher2 = Contract.createMatcher({
		type: 'sw.blob',
		slug: 'nodejs'
	})

	container.findChildren(matcher1)
	container.findChildren(matcher2)
	container.addChild(contract5)

	const cache = new MatcherCache()
	cache.add(matcher2, [ contract3 ])

	test.deepEqual(container.metadata.children.searchCache, cache)
})

test('should clear the cache for a certain type if a contract is removed', (test) => {
	const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
	const contract2 = new Contract(CONTRACTS['sw.os'].fedora['25'].object)
	const contract3 = new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object)
	const contract4 = new Contract(CONTRACTS['hw.device-type'].artik10.object)
	const contract5 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)

	const container = new Contract({
		type: 'foo',
		slug: 'bar'
	})

	container.addChildren([ contract1, contract2, contract3, contract4, contract5 ])

	const matcher1 = Contract.createMatcher({
		type: 'sw.os',
		slug: 'debian'
	})

	const matcher2 = Contract.createMatcher({
		type: 'sw.blob',
		slug: 'nodejs'
	})

	container.findChildren(matcher1)
	container.findChildren(matcher2)
	container.removeChild(contract5)

	const cache = new MatcherCache()
	cache.add(matcher2, [ contract3 ])

	test.deepEqual(container.metadata.children.searchCache, cache)
})

test('should clear the cache for a certain type if the removed contract did not exist', (test) => {
	const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
	const contract2 = new Contract(CONTRACTS['sw.os'].fedora['25'].object)
	const contract3 = new Contract(CONTRACTS['sw.os'].debian.sid.object)

	const container = new Contract({
		type: 'foo',
		slug: 'bar'
	})

	container.addChildren([ contract1, contract2 ])

	const matcher1 = Contract.createMatcher({
		type: 'sw.os',
		slug: 'debian'
	})

	container.findChildren(matcher1)
	container.removeChild(contract3)

	const cache = new MatcherCache()
	cache.add(matcher1, [ contract1 ])

	test.deepEqual(container.metadata.children.searchCache, cache)
})
