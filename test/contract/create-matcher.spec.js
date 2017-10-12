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
const Contract = require('../../lib/contract')

ava.test('should create contract instance', (test) => {
  const matcher = Contract.createMatcher({
    type: 'arch.sw',
    slug: 'armv7hf'
  })

  test.true(matcher instanceof Contract)
})

ava.test('should include the properties in data', (test) => {
  const matcher = Contract.createMatcher({
    type: 'arch.sw',
    slug: 'armv7hf'
  })

  test.deepEqual(matcher.raw.data, {
    type: 'arch.sw',
    slug: 'armv7hf'
  })
})

ava.test('should set the type appropriately', (test) => {
  const matcher = Contract.createMatcher({
    type: 'arch.sw',
    slug: 'armv7hf'
  })

  test.is(matcher.getType(), 'meta.matcher')
})

ava.test('should be able to set the operation name', (test) => {
  const matcher = Contract.createMatcher({
    type: 'arch.sw',
    slug: 'armv7hf'
  }, {
    operation: 'or'
  })

  test.is(matcher.raw.operation, 'or')
})
