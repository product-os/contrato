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

const assetsContract = _.merge({}, baseContract, {
  assets: {
    asset: {
      url: 'https://test.url',
      checksum: 'checksum',
      checksumType: 'sha256'
    }
  }
})

ava.test('should validate assets contract', (test) => {
  test.deepEqual(
    {
      success: true,
      errors: []
    },
    validation.checkContract(assetsContract)
  )
})

ava.test('should reject bad assets contract', (test) => {
  const result = validation.checkContract(_.omit(assetsContract, 'assets.asset.url'))
  test.is(false, result.success)
  test.is('data.assets[\'asset\'] should have required property \'url\'', result.errors[0])
})

ava.test('should reject bad assets contract', (test) => {
  const result = validation.checkContract(_.omit(assetsContract, 'assets.asset.checksumType'))
  test.is(false, result.success)
  test.is('data.assets[\'asset\'] should have property checksumType when property checksum is present', result.errors[0])
})
