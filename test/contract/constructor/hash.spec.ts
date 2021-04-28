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
const Contract = require('../../../lib/contract')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CONTRACTS'... Remove this comment to see the full error message
const CONTRACTS = require('../../contracts.json')

ava('should hash the contract by default', (test) => {
  const contract = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  test.is(typeof contract.metadata.hash, 'string')
})

ava('should not hash the contract if hash is set to false', (test) => {
  const contract = new Contract(CONTRACTS['sw.os'].debian.wheezy.object, {
    hash: false
  })

  test.is(typeof contract.metadata.hash, 'undefined')
})
