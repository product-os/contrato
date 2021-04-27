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

ava('should get nothing if no children', (test) => {
  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  test.deepEqual(container.getChildren(), [])
})

ava('should get the paths of a one child container', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChild(contract1)

  test.deepEqual(container.getChildren(), [
    contract1
  ])
})

ava('should get the paths of two contracts with different slugs', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.os'].fedora['25'].object)
  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChildren([ contract1, contract2 ])

  test.deepEqual(container.getChildren(), [
    contract1,
    contract2
  ])
})

ava('should get the paths of two contracts with same slugs', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.os'].debian.jessie.object)
  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChildren([ contract1, contract2 ])

  test.deepEqual(container.getChildren(), [
    contract1,
    contract2
  ])
})

ava('should be able to filter by one type', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object)
  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChildren([ contract1, contract2 ])

  test.deepEqual(container.getChildren({
    types: new Set([ 'sw.os' ])
  }), [
    contract1
  ])
})

ava('should be able to filter by two types', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object)
  const contract3 = new Contract(CONTRACTS['hw.device-type'].artik10.object)
  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChildren([ contract1, contract2, contract3 ])

  test.deepEqual(container.getChildren({
    types: new Set([ 'sw.os', 'sw.blob' ])
  }), [
    contract1,
    contract2
  ])
})

ava('should ignore unknown types', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object)
  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChildren([ contract1, contract2 ])

  test.deepEqual(container.getChildren({
    types: new Set([ 'sw.os', 'hello' ])
  }), [
    contract1
  ])
})

ava('should return an empty array if no type matches', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object)
  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChildren([ contract1, contract2 ])

  test.deepEqual(container.getChildren({
    types: new Set([ 'hello', 'world' ])
  }), [])
})

ava('should not return the same contract multiple times if it contains aliases', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object)
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

  test.deepEqual(container.getChildren(), [
    contract1,
    contract2
  ])
})

ava('should return nested children', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object)
  contract1.addChild(contract2)

  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChildren([ contract1 ])

  test.deepEqual(container.getChildren(), [
    contract1,
    contract2
  ])
})

ava('should return two level nested children', (test) => {
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

  test.deepEqual(container.getChildren(), [
    contract1,
    contract2,
    contract3
  ])
})

ava('should return nested children that match the desired type', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object)
  contract1.addChild(contract2)

  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChildren([ contract1 ])

  test.deepEqual(container.getChildren({
    types: new Set([ 'sw.blob' ])
  }), [
    contract2
  ])
})
