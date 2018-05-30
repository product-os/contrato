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

const ava = require('ava')
const _ = require('lodash')
const validation = require('../../lib/validation')

const baseContract = require('./common/baseContract')

const capabilitiesContract = _.merge({}, baseContract, {
  capabilities: [
    {
      slug: 'slug',
      componentVersion: 'componentVersion'
    },
    {
      slug: 'slug'
    }
  ]
})

const badCapabilitiesContract = _.merge({}, baseContract, {
  capabilities: [
    {
      componentVersion: 'componentVersion'
    }
  ]
})

ava.test('should validate capabilities contract', (test) => {
  test.deepEqual(
    {
      success: true, errors: []
    },
    validation.checkContract(capabilitiesContract)
  )
})

ava.test('should reject bad capabilities contract', (test) => {
  const result = validation.checkContract(badCapabilitiesContract)
  test.is(false, result.success)
  test.is('data.capabilities[0] should have required property \'slug\'', result.errors[0])
})
