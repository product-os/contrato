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
const validation = require('../../lib/validation')

const baseContract = require('./common/baseContract')

const requireContract = _.merge({}, baseContract, {
  requires: [
    {
      or: [
        {
          type: 'type'
        },
        {
          or: [
            {
              slug: 'slug'
            }
          ]
        }
      ]
    }
  ]
})

const externalRequireContract = _.merge({}, baseContract, {
  requires: [
    {
      data: {
        prop: 'prop'
      }
    }
  ]
})

const badExternalRequireContract = _.merge({}, baseContract, {
  requires: [
    {
      or: [
        {
          type: 'type'
        },
        {
          or: [
            {
              prop: 'prop'
            }
          ]
        }
      ]
    }
  ]
})

const badExternalRequireContract2 = _.merge({}, baseContract, {
  requires: [
    {
      or: [
        {
          version: '1'
        }
      ]
    }
  ]
})

ava.test('should validate require contract', (test) => {
  test.deepEqual(
    {
      success: true,
      errors: []
    },
    validation.checkContract(requireContract)
  )
})

ava.test('should validate require contract with unknown fields', (test) => {
  test.deepEqual(
    {
      success: true, errors: []
    },
    validation.checkContract(externalRequireContract)
  )
})

ava.test('should reject bad require contract with unknown fields', (test) => {
  const result = validation.checkContract(badExternalRequireContract)
  test.is(false, result.success)
})

ava.test('should reject bad require contract that only specifies version', (test) => {
  const result = validation.checkContract(badExternalRequireContract2)
  test.is(false, result.success)
})
