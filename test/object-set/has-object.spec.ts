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

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ObjectSet'... Remove this comment to see the full error message
const ObjectSet = require('../../lib/object-set')

ava('should return true if the object exists', (test) => {
  const set = new ObjectSet([
    {
      foo: 1
    },
    {
      foo: 2
    }
  ])

  test.true(set.hasObject({
    foo: 2
  }))
})

ava('should return false if the object does not exist', (test) => {
  const set = new ObjectSet([
    {
      foo: 1
    },
    {
      foo: 2
    }
  ])

  test.false(set.hasObject({
    foo: 3
  }))
})
