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

import ObjectSet from '../../lib/object-set';

test('should return zero if the set has no objects', (test) => {
	const set = new ObjectSet()
	test.is(set.size(), 0)
})

test('should return one if the set has one object', (test) => {
	const set = new ObjectSet([
		{
			foo: 1
		}
	])

	test.is(set.size(), 1)
})

test('should return two if the set has two object', (test) => {
	const set = new ObjectSet([
		{
			foo: 1
		},
		{
			foo: 2
		}
	])

	test.is(set.size(), 2)
})

test('should ignore duplicates', (test) => {
	const set = new ObjectSet([
		{
			foo: 1
		},
		{
			foo: 1
		}
	])

	test.is(set.size(), 1)
})

test('should change if new objects are added', (test) => {
	const set = new ObjectSet()

	set.add({
		foo: 1
	})

	test.is(set.size(), 1)

	set.add({
		foo: 2
	})

	test.is(set.size(), 2)
})
