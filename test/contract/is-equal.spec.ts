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

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ava'.
const ava = require('ava')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Contract'.
const Contract = require('../../lib/contract')

ava('should return true if the contracts are equal', (test) => {
  const contract1 = new Contract({
    type: 'arch.sw',
    name: 'armv7hf',
    slug: 'armv7hf'
  })

  const contract2 = new Contract({
    type: 'arch.sw',
    name: 'armv7hf',
    slug: 'armv7hf'
  })

  test.true(Contract.isEqual(contract1, contract2))
})

ava('should return false if the contracts are different', (test) => {
  const contract1 = new Contract({
    type: 'arch.sw',
    name: 'armv7hf',
    slug: 'armv7hf'
  })

  const contract2 = new Contract({
    type: 'arch.sw',
    name: 'i386',
    slug: 'i386'
  })

  test.false(Contract.isEqual(contract1, contract2))
})

ava('should return false if the contracts are different but have not been hashed', (test) => {
  const contract1 = new Contract({
    type: 'arch.sw',
    name: 'armv7hf',
    slug: 'armv7hf'
  }, {
    hash: false
  })

  const contract2 = new Contract({
    type: 'arch.sw',
    name: 'i386',
    slug: 'i386'
  }, {
    hash: false
  })

  test.false(Contract.isEqual(contract1, contract2))
})

ava('should return true if the contracts are equal but have not been hashed', (test) => {
  const contract1 = new Contract({
    type: 'arch.sw',
    name: 'armv7hf',
    slug: 'armv7hf'
  }, {
    hash: false
  })

  const contract2 = new Contract({
    type: 'arch.sw',
    name: 'armv7hf',
    slug: 'armv7hf'
  }, {
    hash: false
  })

  test.true(Contract.isEqual(contract1, contract2))
})
