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

const conflictsContract = _.merge({}, baseContract, {
  conflicts: [
    {
      slug: 'slug',
      version: '1'
    },
    {
      'slug': 'slug'
    }
  ]
})

const badConflictsContract = _.merge({}, baseContract, {
  conflicts: [
    {
      'a': 'a'
    }
  ]
})

ava.test('should validate conflicts contract', (test) => {
  test.deepEqual(
    { success: true, errors: [] },
    validation.checkContract(conflictsContract)
  )
})

ava.test('should reject bad conflicts contract', (test) => {
  let { success, errors } = validation.checkContract(badConflictsContract)
  test.is(false, success)
})
