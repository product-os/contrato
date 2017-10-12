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
const hash = require('../../lib/hash')

ava.test('should return a string', (test) => {
  test.true(_.isString(hash.hashObject({
    foo: 'bar'
  })))
})

ava.test('should not care about properties order', (test) => {
  const hash1 = hash.hashObject({
    foo: 'bar',
    bar: 'baz'
  })

  const hash2 = hash.hashObject({
    bar: 'baz',
    foo: 'bar'
  })

  test.deepEqual(hash1, hash2)
})

ava.test('should not rely on object references', (test) => {
  const object = {
    foo: 'bar'
  }

  const hash1 = hash.hashObject(_.cloneDeep(object))
  const hash2 = hash.hashObject(_.cloneDeep(object))
  const hash3 = hash.hashObject(_.cloneDeep(object))

  test.deepEqual(hash1, hash2)
  test.deepEqual(hash2, hash3)
  test.deepEqual(hash3, hash1)
})

ava.test('should return different hashes for different objects', (test) => {
  const hash1 = hash.hashObject({
    foo: 'bar'
  })

  const hash2 = hash.hashObject({
    foo: 'baz'
  })

  const hash3 = hash.hashObject({
    foo: 'qux'
  })

  test.notDeepEqual(hash1, hash2)
  test.notDeepEqual(hash2, hash3)
  test.notDeepEqual(hash3, hash1)
})
