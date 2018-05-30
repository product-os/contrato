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

const overlappingSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'overlapping.schema',
  type: 'object',
  properties: {
    data: {
      type: 'object',
      properties: {
        test: {
          type: 'string'
        },
        optional: {
          type: 'string'
        }
      },
      required: [ 'test' ]
    }
  },
  required: [ 'data' ]
}

const overlappingContract = _.merge({}, baseContract, {
  data: {
    test: 'test'
  }
})

ava.test('should validate overlapping contract', (test) => {
  test.deepEqual(
    {
      success: true, errors: []
    },
    validation.checkContract(overlappingContract, overlappingSchema)
  )
})

ava.test('Should reject invald overlapping contract', (test) => {
  const result = validation.checkContract(baseContract, overlappingSchema)
  test.is(false, result.success)
  test.is('data.data should have required property \'test\'', result.errors[0])
})

ava.test('Should reject invald overlapping contract', (test) => {
  const result = validation.checkContract(_.omit(overlappingContract, 'data.test'), overlappingSchema)
  test.is(false, result.success)
  test.is('data.data should have required property \'test\'', result.errors[0])
})
