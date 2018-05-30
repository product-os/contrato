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

const fatherContract = _.merge({}, baseContract, {
  children: {
    base: baseContract
  }
})

const grampaContract = _.merge({}, baseContract, {
  children: {
    father: {
      child1: baseContract,
      child2: baseContract
    }
  }
})

const badFamilyContract = _.merge({}, baseContract, {
  children: {
    father: {
      child: {
        prop: true
      }
    }
  }
})

ava.test('should validate father contract', (test) => {
  test.deepEqual(
    {
      success: true, errors: []
    },
    validation.checkContract(fatherContract)
  )
})

ava.test('should validate grampa contract', (test) => {
  test.deepEqual(
    {
      success: true, errors: []
    },
    validation.checkContract(grampaContract)
  )
})

ava.test('should reject bad family contract', (test) => {
  const result = validation.checkContract(badFamilyContract)
  test.is(false, result.success)
})
