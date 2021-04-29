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

import Contract from '../../../lib/contract';
import Blueprint from '../../../lib/blueprint';

_.each([
	'path_finding'
], (testName) => {
	const testCase = require(`./${testName}.json`);

	test(testName, (test) => {
		const contracts = _.flatMap(testCase.universe1, Contract.build)
		const container = new Contract({
			type: 'meta.universe'
		})

		container.addChildren(contracts)

		const contracts2 = _.flatMap(testCase.universe2, Contract.build)
		const container2 = new Contract({
			type: 'meta.universe'
		})

		container2.addChildren(contracts2)

		const blueprint = new Blueprint(testCase.blueprint1.layout, testCase.blueprint1.template)
		const result = blueprint.sequence(container)
		test.deepEqual(testCase.path1, _.invokeMap(result, 'toJSON'))

		const blueprint2 = new Blueprint(testCase.blueprint2.layout, testCase.blueprint2.template)
		const result2 = blueprint2.sequence(container2)
		test.deepEqual(testCase.path2, _.invokeMap(result2, 'toJSON'))
	})
})
