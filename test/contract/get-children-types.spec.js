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

ava.test('should return an empty set if no children', (test) => {
  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  test.deepEqual(container.getChildrenTypes(), new Set())
})

ava.test('should return one type given one child', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChild(contract1)

  test.deepEqual(container.getChildrenTypes(), new Set([ 'sw.os' ]))
})

ava.test('should ignore duplicate types', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.os'].debian.jessie.object)
  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChildren([ contract1, contract2 ])
  test.deepEqual(container.getChildrenTypes(), new Set([ 'sw.os' ]))
})

ava.test('should return all children types', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object)
  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChildren([ contract1, contract2 ])
  test.deepEqual(container.getChildrenTypes(), new Set([ 'sw.os', 'sw.blob' ]))
})

ava.test('should update the types when adding a contract', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object)
  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChildren([ contract1 ])
  container.addChildren([ contract2 ])
  test.deepEqual(container.getChildrenTypes(), new Set([ 'sw.os', 'sw.blob' ]))
})

ava.test('should consider nested children', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object)
  contract1.addChild(contract2)
  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChildren([ contract1 ])

  test.deepEqual(container.getChildrenTypes(), new Set([ 'sw.os', 'sw.blob' ]))
})

ava.test('should consider two level nested children', (test) => {
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

  test.deepEqual(container.getChildrenTypes(), new Set([
    'hw.device-type',
    'sw.os',
    'sw.blob'
  ]))
})
