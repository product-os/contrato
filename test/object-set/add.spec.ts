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

ava('should add an object to an empty set', (test) => {
  const set = new ObjectSet()

  set.add({
    foo: 'bar'
  })

  test.deepEqual(set.getAll(), [
    {
      foo: 'bar'
    }
  ])
})

ava('should add an object to a non empty set', (test) => {
  const set = new ObjectSet([
    {
      foo: 1
    }
  ])

  set.add({
    foo: 2
  })

  test.deepEqual(set.getAll(), [
    {
      foo: 1
    },
    {
      foo: 2
    }
  ])
})

ava('should not add a duplicate object', (test) => {
  const set = new ObjectSet([
    {
      foo: 1
    }
  ])

  set.add({
    foo: 1
  })

  test.deepEqual(set.getAll(), [
    {
      foo: 1
    }
  ])
})

ava('should allow the user to set a custom id', (test) => {
  const set = new ObjectSet([])

  set.add({
    foo: 1
  }, {
    id: 'foo'
  })

  test.deepEqual(set.data, {
    foo: {
      foo: 1
    }
  })
})
