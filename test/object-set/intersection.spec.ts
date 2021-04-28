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

ava('should calculate the intersection of two sets', (test) => {
  const set1 = new ObjectSet()
  const set2 = new ObjectSet()

  set1.add({
    foo: 'bar'
  })

  set1.add({
    bar: 'baz'
  })

  set2.add({
    bar: 'baz'
  })

  set2.add({
    qux: 'foo'
  })

  set1.intersection(set2)

  test.deepEqual(set1.getAll(), [
    {
      bar: 'baz'
    }
  ])
})

ava('should return the instance', (test) => {
  const set1 = new ObjectSet()
  const set2 = new ObjectSet()

  set1.add({
    foo: 'bar'
  })

  set2.add({
    foo: 'bar'
  })

  test.deepEqual(set1.intersection(set2), set1)
})

ava('should calculate the intersection of two disjoint sets', (test) => {
  const set1 = new ObjectSet()
  const set2 = new ObjectSet()

  set1.add({
    foo: 'bar'
  })

  set1.add({
    bar: 'baz'
  })

  set2.add({
    qux: 'foo'
  })

  set1.intersection(set2)

  test.deepEqual(set1.getAll(), [])
})

ava('should return an empty array if the left set is empty', (test) => {
  const set1 = new ObjectSet()
  const set2 = new ObjectSet()

  set2.add({
    qux: 'foo'
  })

  set1.intersection(set2)

  test.deepEqual(set1.getAll(), [])
})

ava('should return an empty array if the right set is empty', (test) => {
  const set1 = new ObjectSet()
  const set2 = new ObjectSet()

  set1.add({
    qux: 'foo'
  })

  set1.intersection(set2)

  test.deepEqual(set1.getAll(), [])
})

ava('should take custom ids into account', (test) => {
  const set1 = new ObjectSet()
  const set2 = new ObjectSet()

  set1.add({
    foo: 'bar'
  }, {
    id: 'foobar'
  })

  set1.add({
    bar: 'baz'
  }, {
    id: 'barbaz'
  })

  set2.add({
    bar: 'baz'
  }, {
    id: 'barbaz'
  })

  set2.add({
    qux: 'foo'
  }, {
    id: 'quxfoo'
  })

  set1.intersection(set2)

  test.deepEqual(set1.getAll(), [
    {
      bar: 'baz'
    }
  ])
})

ava('should trust ids rather than objects', (test) => {
  const set1 = new ObjectSet()
  const set2 = new ObjectSet()

  set1.add({
    foo: 'bar'
  }, {
    id: 'foobar'
  })

  set1.add({
    bar: 'baz'
  }, {
    id: 'barbaz'
  })

  set2.add({
    bar: 'baz'
  }, {
    id: 'barbaz2'
  })

  set2.add({
    qux: 'foo'
  }, {
    id: 'quxfoo'
  })

  set1.intersection(set2)

  test.deepEqual(set1.getAll(), [])
})
