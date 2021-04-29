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
import { setMap } from '../../lib/utils';

test('should return an empty array given an empty set', (test) => {
	const set = new Set<number>()
	test.deepEqual(setMap(set, (element) => {
		return element * 2
	}), [])
})

test('should run the iteratee on all elements', (test) => {
	const set = new Set([ 1, 2, 3 ])
	test.deepEqual(setMap(set, (element) => {
		return element * 2
	}), [ 2, 4, 6 ])
})
