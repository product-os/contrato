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

test('should create an empty set', (test) => {
	const set = new ObjectSet()
	test.deepEqual(set.getAll(), [])
})

test('should create a set with objects', (test) => {
	const set = new ObjectSet([
		{
			foo: 1
		},
		{
			foo: 2
		}
	])

	test.deepEqual(set.getAll(), [
		{
			foo: 1
		},
		{
			foo: 2
		}
	])
})

test('should ignore duplicate objects', (test) => {
	const set = new ObjectSet([
		{
			foo: 1
		},
		{
			foo: 1
		}
	])

	test.deepEqual(set.getAll(), [
		{
			foo: 1
		}
	])
})

test('should be able to set objects with custom ids', (test) => {
	const set = new ObjectSet([
		[
			{
				foo: 1
			},
			{
				id: 'one'
			}
		],
		[
			{
				foo: 2
			},
			{
				id: 'two'
			}
		]
	])

	test.deepEqual(set.getAll(), [
		{
			foo: 1
		},
		{
			foo: 2
		}
	])

	test.true(set.hasId('one'))
	test.true(set.hasId('two'))
})
