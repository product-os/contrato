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

ava('should return the reference string of a contract without a version', (test) => {
  const contract = new Contract({
    type: 'sw.arch',
    slug: 'armv7hf',
    name: 'ARMV7HF'
  })

  test.is(contract.getReferenceString(), 'armv7hf')
})

ava('should return the reference string of a contract with a version', (test) => {
  const contract = new Contract({
    type: 'sw.os',
    slug: 'debian',
    version: 'wheezy',
    name: 'Debian Wheezy'
  })

  test.is(contract.getReferenceString(), 'debian@wheezy')
})
