/*
 * Copyright 2018 resin.io
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

const ava = require('ava')
const _ = require('lodash')
const Contract = require('../../lib/contract')
const Composite = require('../../lib/composite')

_.each([
	'resin-os',
	'resin-os-arch',
	'multi-arch-device',
	'supervisor'
], (testName) => {
  const testCase = require(`./${testName}.json`)

  ava.test(testName, (test) => {
    const contracts = _.flatMap(testCase.universe, Contract.build)
    const container = new Contract({
      type: 'meta.universe'
    })

    container.addChildren(contracts)

    const composite = new Composite(testCase.blueprint.layout, testCase.blueprint.skeleton)
    const result = composite.apply(container)
    test.deepEqual(testCase.contexts, _.invokeMap(result, 'toJSON'))
  })
})