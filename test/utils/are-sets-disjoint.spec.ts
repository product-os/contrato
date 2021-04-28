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

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'utils'.
const utils = require('../../lib/utils')

ava('should return true if sets are disjoint', (test) => {
  const set1 = new Set([ 'foo', 'bar' ])
  const set2 = new Set([ 'baz', 'qux' ])

  test.true(utils.areSetsDisjoint(set1, set2))
  test.true(utils.areSetsDisjoint(set2, set1))
})

ava('should return false if sets are not disjoint', (test) => {
  const set1 = new Set([ 'foo', 'bar' ])
  const set2 = new Set([ 'bar', 'baz' ])

  test.false(utils.areSetsDisjoint(set1, set2))
  test.false(utils.areSetsDisjoint(set2, set1))
})

ava('should return true if both sets are empty', (test) => {
  test.true(utils.areSetsDisjoint(new Set(), new Set()))
})

ava('should return true if one of the sets is empty', (test) => {
  const set1 = new Set([ 'foo', 'bar' ])
  const set2 = new Set()

  test.true(utils.areSetsDisjoint(set1, set2))
  test.true(utils.areSetsDisjoint(set2, set1))
})
