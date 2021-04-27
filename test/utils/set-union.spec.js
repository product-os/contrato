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
const utils = require('../../lib/utils')

ava('should return an empty set for the union of two empty sets', (test) => {
  const set1 = new Set()
  const set2 = new Set()
  const result = new Set()

  test.deepEqual(utils.setUnion(set1, set2), result)
})

ava('should return the union of two disjoint sets', (test) => {
  const set1 = new Set([ 1, 2 ])
  const set2 = new Set([ 3, 4 ])
  const result = new Set([ 1, 2, 3, 4 ])

  test.deepEqual(utils.setUnion(set1, set2), result)
})

ava('should return the union of two joint sets', (test) => {
  const set1 = new Set([ 1, 2 ])
  const set2 = new Set([ 2, 3 ])
  const result = new Set([ 1, 2, 3 ])

  test.deepEqual(utils.setUnion(set1, set2), result)
})

ava('should return an inverted result if the arguments are flipped', (test) => {
  const set1 = new Set([ 1, 2 ])
  const set2 = new Set([ 3, 4 ])

  const result1 = new Set([ 1, 2, 3, 4 ])
  const result2 = new Set([ 3, 4, 1, 2 ])

  test.deepEqual(utils.setUnion(set1, set2), result1)
  test.deepEqual(utils.setUnion(set2, set1), result2)
})

ava('should return the first set if the second one is empty', (test) => {
  const set1 = new Set([ 1, 2 ])
  const set2 = new Set()

  test.deepEqual(utils.setUnion(set1, set2), set1)
})

ava('should return the second set if the first one is empty', (test) => {
  const set1 = new Set()
  const set2 = new Set([ 1, 2 ])

  test.deepEqual(utils.setUnion(set1, set2), set2)
})
