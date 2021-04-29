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
import { stripExtraBlankLines } from '../../lib/utils';

test('should replace two blank lines with one', (test) => {
	const result = _.split(stripExtraBlankLines(_.join([
		'Hello',
		'',
		'',
		'World',
		'',
		'',
		'!'
	], '\n')), '\n')

	test.deepEqual(result, [
		'Hello',
		'',
		'World',
		'',
		'!'
	])
})

test('should replace three blank lines with one', (test) => {
	const result = _.split(stripExtraBlankLines(_.join([
		'Hello',
		'',
		'',
		'',
		'World',
		'',
		'',
		'',
		'!'
	], '\n')), '\n')

	test.deepEqual(result, [
		'Hello',
		'',
		'World',
		'',
		'!'
	])
})

test('should remove a single leading blank line', (test) => {
	const result = _.split(stripExtraBlankLines(_.join([
		'',
		'Hello'
	], '\n')), '\n')

	test.deepEqual(result, [
		'Hello'
	])
})

test('should remove two leading blank lines', (test) => {
	const result = _.split(stripExtraBlankLines(_.join([
		'',
		'',
		'Hello'
	], '\n')), '\n')

	test.deepEqual(result, [
		'Hello'
	])
})

test('should remove a single trailing blank line', (test) => {
	const result = _.split(stripExtraBlankLines(_.join([
		'Hello',
		''
	], '\n')), '\n')

	test.deepEqual(result, [
		'Hello'
	])
})

test('should remove two trailing blank lines', (test) => {
	const result = _.split(stripExtraBlankLines(_.join([
		'Hello',
		'',
		''
	], '\n')), '\n')

	test.deepEqual(result, [
		'Hello'
	])
})
