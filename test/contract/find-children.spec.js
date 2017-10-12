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
const CONTRACTS = require('../contracts.json')

ava.test('should find nothing given no properties', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChild(contract1)

  test.deepEqual(container.findChildren({}), [])
})

ava.test('should find a specific unique contract based on its type and name', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.os'].fedora['25'].object)
  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChildren([ contract1, contract2 ])

  test.deepEqual(container.findChildren(Contract.createMatcher({
    name: 'Debian Wheezy',
    type: 'sw.os'
  })), [
    contract1
  ])
})

ava.test('should find a specific unique contract based on its type and slug', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.os'].debian.jessie.object)
  const contract3 = new Contract(CONTRACTS['sw.os'].fedora['25'].object)
  const contract4 = new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object)
  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChildren([ contract1, contract2, contract3, contract4 ])

  test.deepEqual(container.findChildren(Contract.createMatcher({
    type: 'sw.os',
    slug: 'fedora'
  })), [
    contract3
  ])
})

ava.test('should find a specific unique contract based on another property', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.os'].debian.jessie.object)
  const contract3 = new Contract(CONTRACTS['sw.os'].fedora['25'].object)
  const contract4 = new Contract(CONTRACTS['hw.device-type'].artik10.object)
  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChildren([ contract1, contract2, contract3, contract4 ])

  test.deepEqual(container.findChildren(Contract.createMatcher({
    type: 'hw.device-type',
    arch: 'armv7hf'
  })), [
    contract4
  ])
})

ava.test('should find multiple contracts based on a type', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.os'].debian.jessie.object)
  const contract3 = new Contract(CONTRACTS['sw.os'].fedora['25'].object)
  const contract4 = new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object)
  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChildren([ contract1, contract2, contract3, contract4 ])

  test.deepEqual(container.findChildren(Contract.createMatcher({
    type: 'sw.os'
  })), [
    contract1,
    contract2,
    contract3
  ])
})

ava.test('should find nothing based on a non-existent type', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.os'].debian.jessie.object)
  const contract3 = new Contract(CONTRACTS['sw.os'].fedora['25'].object)
  const contract4 = new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object)
  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChildren([ contract1, contract2, contract3, contract4 ])

  test.deepEqual(container.findChildren(Contract.createMatcher({
    type: 'non-existent-type'
  })), [])
})

ava.test('should find nothing because of an invalid type', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.os'].debian.jessie.object)
  const contract3 = new Contract(CONTRACTS['sw.os'].fedora['25'].object)
  const contract4 = new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object)
  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChildren([ contract1, contract2, contract3, contract4 ])

  test.deepEqual(container.findChildren(Contract.createMatcher({
    type: 'non-existent-type',
    slug: 'debian'
  })), [])
})

ava.test('should find a contract based on one of its aliases', (test) => {
  const contract1 = new Contract({
    type: 'hw.device-type',
    name: 'Raspberry Pi 2',
    slug: 'raspberrypi2',
    aliases: [ 'rpi2', 'raspberry-pi2' ]
  })

  const contract2 = new Contract({
    type: 'hw.device-type',
    name: 'Raspberry Pi',
    slug: 'raspberrypi',
    aliases: [ 'rpi', 'raspberry-pi' ]
  })

  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChildren([ contract1, contract2 ])

  test.deepEqual(container.findChildren(Contract.createMatcher({
    type: 'hw.device-type',
    slug: 'rpi'
  })), [ contract2 ])
})

ava.test('should find a nested contract by its type and slug', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.os'].debian.jessie.object)
  const contract3 = new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object)

  contract1.addChild(contract3)

  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChildren([ contract1, contract2 ])

  test.deepEqual(container.findChildren(Contract.createMatcher({
    type: 'sw.blob',
    slug: 'nodejs'
  })), [
    contract3
  ])
})

ava.test('should find a nested contract by its type and another property', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.os'].debian.jessie.object)
  const contract3 = new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object)

  contract1.addChild(contract3)

  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChildren([ contract1, contract2 ])

  test.deepEqual(container.findChildren(Contract.createMatcher({
    type: 'sw.blob',
    version: '4.8.0'
  })), [
    contract3
  ])
})

ava.test('should fail to find a nested contract with an incorrect slug', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.os'].debian.jessie.object)
  const contract3 = new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object)

  contract1.addChild(contract3)

  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChildren([ contract1, contract2 ])

  test.deepEqual(container.findChildren(Contract.createMatcher({
    type: 'sw.blob',
    slug: 'java'
  })), [])
})

ava.test('should fail to find a nested contract with an incorrect type', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.os'].debian.jessie.object)
  const contract3 = new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object)

  contract1.addChild(contract3)

  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChildren([ contract1, contract2 ])

  test.deepEqual(container.findChildren(Contract.createMatcher({
    type: 'sw.os',
    slug: 'nodejs'
  })), [])
})

ava.test('should be able to find a two level nested children using its type', (test) => {
  const contract1 = new Contract(CONTRACTS['hw.device-type'].artik10.object)
  const contract2 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract3 = new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object)
  contract2.addChild(contract3)
  contract1.addChild(contract2)

  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChildren([ contract1 ])

  test.deepEqual(container.findChildren(Contract.createMatcher({
    type: 'sw.blob'
  })), [ contract3 ])
})
