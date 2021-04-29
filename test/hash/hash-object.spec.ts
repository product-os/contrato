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
import * as _ from 'lodash';
import { hashObject } from '../../lib/hash';

test('should return a string', (test) => {
	test.true(_.isString(hashObject({
		foo: 'bar'
	})))
})

test('should not care about properties order', (test) => {
	const hash1 = hashObject({
		foo: 'bar',
		bar: 'baz'
	})

	const hash2 = hashObject({
		bar: 'baz',
		foo: 'bar'
	})

	test.deepEqual(hash1, hash2)
})

test('should not rely on object references', (test) => {
	const object = {
		foo: 'bar'
	}

	const hash1 = hashObject(_.cloneDeep(object))
	const hash2 = hashObject(_.cloneDeep(object))
	const hash3 = hashObject(_.cloneDeep(object))

	test.deepEqual(hash1, hash2)
	test.deepEqual(hash2, hash3)
	test.deepEqual(hash3, hash1)
})

test('should return different hashes for different objects', (test) => {
	const hash1 = hashObject({
		foo: 'bar'
	})

	const hash2 = hashObject({
		foo: 'baz'
	})

	const hash3 = hashObject({
		foo: 'qux'
	})

	test.notDeepEqual(hash1, hash2)
	test.notDeepEqual(hash2, hash3)
	test.notDeepEqual(hash3, hash1)
})
