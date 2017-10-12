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
const hash = require('../../lib/hash')
const CONTRACTS = require('../contracts.json')
const SKELETON = {
  type: 'foo',
  slug: 'bar'
}

ava.test('should delete a contract from a set of contracts', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.os'].debian.jessie.object)
  const contract3 = new Contract(CONTRACTS['sw.os'].fedora['25'].object)

  const container = new Contract(SKELETON)
  container.addChildren([ contract1, contract2, contract3 ])
  container.removeChild(contract2)

  const expected = new Contract(SKELETON)
  expected.addChildren([ contract1, contract3 ])
  test.deepEqual(container, expected)
})

ava.test('should ignore contracts that are not in the set', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.os'].debian.jessie.object)
  const contract3 = new Contract(CONTRACTS['sw.os'].fedora['25'].object)

  const container = new Contract(SKELETON)
  container.addChildren([ contract1, contract2, contract3 ])
  container.removeChild(new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object))

  const expected = new Contract(SKELETON)
  expected.addChildren([ contract1, contract2, contract3 ])
  test.deepEqual(container, expected)
})

ava.test('should remove a slug object if it becomes empty after the removal', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.os'].fedora['25'].object)

  const container = new Contract(SKELETON)
  container.addChildren([ contract1, contract2 ])
  container.removeChild(contract1)

  const expected = new Contract(SKELETON)
  expected.addChildren([ contract2 ])
  test.deepEqual(container, expected)
})

ava.test('should correctly handle number versions', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.os'].fedora['24'].object)
  const contract3 = new Contract(CONTRACTS['sw.os'].fedora['25'].object)

  const container = new Contract(SKELETON)
  container.addChildren([ contract1, contract2, contract3 ])
  container.removeChild(contract2)

  const expected = new Contract(SKELETON)
  expected.addChildren([ contract1, contract3 ])
  test.deepEqual(container, expected)
})

ava.test('should ignore an invalid version of an existing contract', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.os'].debian.jessie.object)
  const contract3 = new Contract(CONTRACTS['sw.os'].debian.sid.object)

  const container = new Contract(SKELETON)
  container.addChildren([ contract1, contract2 ])
  container.removeChild(contract3)

  const expected = new Contract(SKELETON)
  expected.addChildren([ contract1, contract2 ])
  test.deepEqual(container, expected)
})

ava.test('should take versions into account before removing a contract from the slug object', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.os'].fedora['24'].object)
  const contract3 = new Contract(CONTRACTS['sw.os'].fedora['25'].object)

  const container = new Contract(SKELETON)
  container.addChildren([ contract1, contract2 ])
  container.removeChild(contract3)

  const expected = new Contract(SKELETON)
  expected.addChildren([ contract1, contract2 ])
  test.deepEqual(container, expected)
})

ava.test('should take versions into account before removing a contract from the type object', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.os'].debian.jessie.object)

  const container = new Contract(SKELETON)
  container.addChildren([ contract1 ])
  container.removeChild(contract2)

  const expected = new Contract(SKELETON)
  expected.addChildren([ contract1 ])
  test.deepEqual(container, expected)
})

ava.test('should remove a type object if it becomes empty after the removal', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object)

  const container = new Contract(SKELETON)
  container.addChildren([ contract1, contract2 ])
  container.removeChild(contract1)

  const expected = new Contract(SKELETON)
  expected.addChildren([ contract2 ])
  test.deepEqual(container, expected)
})

ava.test('should return the object instance', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.os'].debian.jessie.object)
  const contract3 = new Contract(CONTRACTS['sw.os'].fedora['25'].object)

  const container = new Contract(SKELETON)
  container.addChildren([ contract1, contract2, contract3 ])
  test.deepEqual(container.removeChild(contract2), container)
})

ava.test('should return the object instance even if the type does not exist', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.os'].debian.jessie.object)
  const contract3 = new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object)

  const container = new Contract(SKELETON)
  container.addChildren([ contract1, contract2 ])
  test.deepEqual(container.removeChild(contract3), container)
})

ava.test('should remove a contract with aliases', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object)
  const contract2 = new Contract({
    type: 'hw.device-type',
    name: 'Raspberry Pi',
    slug: 'raspberrypi',
    aliases: [ 'rpi', 'raspberry-pi' ]
  })

  const container = new Contract(SKELETON)
  container.addChildren([ contract1, contract2 ])
  container.removeChild(contract2)

  const expected = new Contract(SKELETON)
  expected.addChildren([ contract1 ])
  test.deepEqual(container, expected)
})

ava.test('should remove a contract with aliases when there is another aliased contract of the same type', (test) => {
  const contract1 = new Contract({
    type: 'hw.device-type',
    name: 'Intel NUC',
    slug: 'intel-nuc',
    aliases: [ 'nuc' ]
  })

  const contract2 = new Contract({
    type: 'hw.device-type',
    name: 'Raspberry Pi',
    slug: 'raspberrypi',
    aliases: [ 'rpi', 'raspberry-pi' ]
  })

  const container = new Contract(SKELETON)
  container.addChildren([ contract1, contract2 ])
  container.removeChild(contract2)

  const expected = new Contract(SKELETON)
  expected.addChildren([ contract1 ])
  test.deepEqual(container, expected)
})

ava.test('should remove a contract with aliases when there are two aliased contracts of the same type', (test) => {
  const contract1 = new Contract({
    type: 'hw.device-type',
    name: 'Intel NUC',
    slug: 'intel-nuc',
    aliases: [ 'nuc' ]
  })

  const contract2 = new Contract({
    type: 'hw.device-type',
    name: 'Raspberry Pi',
    slug: 'raspberrypi',
    aliases: [ 'rpi', 'raspberry-pi' ]
  })

  const contract3 = new Contract({
    type: 'hw.device-type',
    name: 'Intel Edison',
    slug: 'intel-edison',
    aliases: [ 'edison' ]
  })

  const container = new Contract(SKELETON)
  container.addChildren([ contract1, contract2, contract3 ])
  container.removeChild(contract2)

  const expected = new Contract(SKELETON)
  expected.addChildren([ contract1, contract3 ])
  test.deepEqual(container, expected)
})

ava.test('should re-hash the universe', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.os'].debian.jessie.object)
  const contract3 = new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object)

  const container = new Contract(SKELETON)
  container.addChildren([ contract1, contract2, contract3 ])
  const oldHash = container.metadata.hash
  container.removeChild(contract3)

  test.not(container.metadata.hash, oldHash)
  test.is(container.metadata.hash, hash.hashObject(container.raw))
})

ava.test('should not re-hash the universe if the rehash option is false', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.os'].debian.jessie.object)
  const contract3 = new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object)

  const container = new Contract(SKELETON)
  container.addChildren([ contract1, contract2, contract3 ])
  const oldHash = container.metadata.hash
  container.removeChild(contract3, {
    rehash: false
  })

  test.is(container.metadata.hash, oldHash)
})
