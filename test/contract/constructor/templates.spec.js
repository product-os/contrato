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
const Contract = require('../../../lib/contract')

ava.test('should resolve templates for which the values exist', (test) => {
  const contract = new Contract({
    type: 'arch.sw',
    version: '7',
    name: 'ARM v{{version}}',
    slug: 'armv7hf'
  })

  test.is(contract.metadata.hash, '0765760c9fefb5bacd69d5d58bfaaab931a75d25')

  test.deepEqual(contract.raw, {
    type: 'arch.sw',
    version: '7',
    name: 'ARM v7',
    slug: 'armv7hf'
  })
})

ava.test('should not resolve templates for which the values do not exist', (test) => {
  const contract = new Contract({
    type: 'arch.sw',
    name: '{{displayName}}',
    slug: 'armv7hf'
  })

  test.is(contract.metadata.hash, '537e4d8e9c1483499c00476d72d5fd635a4b0460')

  test.deepEqual(contract.raw, {
    type: 'arch.sw',
    name: '{{displayName}}',
    slug: 'armv7hf'
  })
})

ava.test('should not hash a templated contract if the hash option is false', (test) => {
  const contract = new Contract({
    type: 'arch.sw',
    version: '7',
    name: 'ARM v{{version}}',
    slug: 'armv7hf'
  }, {
    hash: false
  })

  test.is(typeof contract.metadata.hash, 'undefined')

  test.deepEqual(contract.raw, {
    type: 'arch.sw',
    version: '7',
    name: 'ARM v7',
    slug: 'armv7hf'
  })
})
