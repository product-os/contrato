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
const MatcherCache = require('../../lib/matcher-cache')
const CONTRACTS = require('../contracts.json')

ava.test('should add a set of one contract', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChildren([ contract1 ])

  test.deepEqual(container.metadata.children, {
    typeMatchers: {},
    searchCache: new MatcherCache(),
    types: new Set([ 'sw.os' ]),
    byType: {
      'sw.os': new Set([ contract1.metadata.hash ])
    },
    byTypeSlug: {
      'sw.os': {
        debian: new Set([ contract1.metadata.hash ])
      }
    },
    map: {
      [contract1.metadata.hash]: contract1
    }
  })

  test.deepEqual(container.raw, {
    type: 'foo',
    slug: 'bar',
    children: {
      sw: {
        os: contract1.raw
      }
    }
  })
})

ava.test('should ignore duplicates from contract sets', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChildren([ contract1, contract1, contract1 ])

  test.deepEqual(container.metadata.children, {
    typeMatchers: {},
    searchCache: new MatcherCache(),
    types: new Set([ 'sw.os' ]),
    byType: {
      'sw.os': new Set([ contract1.metadata.hash ])
    },
    byTypeSlug: {
      'sw.os': {
        debian: new Set([ contract1.metadata.hash ])
      }
    },
    map: {
      [contract1.metadata.hash]: contract1
    }
  })

  test.deepEqual(container.raw, {
    type: 'foo',
    slug: 'bar',
    children: {
      sw: {
        os: contract1.raw
      }
    }
  })
})

ava.test('should add a set of multiple contracts to an empty universe', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.os'].debian.jessie.object)

  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChildren([ contract1, contract2 ])

  test.deepEqual(container.metadata.children, {
    typeMatchers: {},
    searchCache: new MatcherCache(),
    types: new Set([ 'sw.os' ]),
    byType: {
      'sw.os': new Set([ contract1.metadata.hash, contract2.metadata.hash ])
    },
    byTypeSlug: {
      'sw.os': {
        debian: new Set([ contract1.metadata.hash, contract2.metadata.hash ])
      }
    },
    map: {
      [contract1.metadata.hash]: contract1,
      [contract2.metadata.hash]: contract2
    }
  })

  test.deepEqual(container.raw, {
    type: 'foo',
    slug: 'bar',
    children: {
      sw: {
        os: {
          debian: [ contract1.raw, contract2.raw ]
        }
      }
    }
  })
})

ava.test('should return the instance', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.os'].debian.jessie.object)
  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  test.deepEqual(container.addChildren([ contract1, contract2 ]), container)
})

ava.test('should return the instance if no contracts', (test) => {
  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  test.deepEqual(container.addChildren(), container)
})

ava.test('should re-hash the universe', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.os'].debian.jessie.object)

  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  const hash = container.metadata.hash
  container.addChildren([ contract1, contract2 ])
  test.not(container.metadata.hash, hash)
})

ava.test('should not re-hash the universe if the rehash option is false', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.os'].debian.jessie.object)

  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  const hash = container.metadata.hash
  container.addChildren([ contract1, contract2 ], {
    rehash: false
  })

  test.is(container.metadata.hash, hash)
})

ava.test('should add a contract of a new slug to an existing type', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.os'].debian.jessie.object)
  const contract3 = new Contract(CONTRACTS['sw.os'].fedora['25'].object)

  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChildren([ contract1, contract2, contract3 ])

  test.deepEqual(container.metadata.children, {
    typeMatchers: {},
    searchCache: new MatcherCache(),
    types: new Set([ 'sw.os' ]),
    byType: {
      'sw.os': new Set([
        contract1.metadata.hash,
        contract2.metadata.hash,
        contract3.metadata.hash
      ])
    },
    byTypeSlug: {
      'sw.os': {
        debian: new Set([
          contract1.metadata.hash,
          contract2.metadata.hash
        ]),
        fedora: new Set([ contract3.metadata.hash ])
      }
    },
    map: {
      [contract1.metadata.hash]: contract1,
      [contract2.metadata.hash]: contract2,
      [contract3.metadata.hash]: contract3
    }
  })

  test.deepEqual(container.raw, {
    type: 'foo',
    slug: 'bar',
    children: {
      sw: {
        os: {
          debian: [ contract1.raw, contract2.raw ],
          fedora: contract3.raw
        }
      }
    }
  })
})

ava.test('should add two contracts of a new slug to an existing type', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.os'].debian.jessie.object)
  const contract3 = new Contract(CONTRACTS['sw.os'].fedora['24'].object)
  const contract4 = new Contract(CONTRACTS['sw.os'].fedora['25'].object)

  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChildren([ contract1, contract2, contract3, contract4 ])

  test.deepEqual(container.metadata.children, {
    typeMatchers: {},
    searchCache: new MatcherCache(),
    types: new Set([ 'sw.os' ]),
    byType: {
      'sw.os': new Set([
        contract1.metadata.hash,
        contract2.metadata.hash,
        contract3.metadata.hash,
        contract4.metadata.hash
      ])
    },
    byTypeSlug: {
      'sw.os': {
        debian: new Set([
          contract1.metadata.hash,
          contract2.metadata.hash
        ]),
        fedora: new Set([
          contract3.metadata.hash,
          contract4.metadata.hash
        ])
      }
    },
    map: {
      [contract1.metadata.hash]: contract1,
      [contract2.metadata.hash]: contract2,
      [contract3.metadata.hash]: contract3,
      [contract4.metadata.hash]: contract4
    }
  })

  test.deepEqual(container.raw, {
    type: 'foo',
    slug: 'bar',
    children: {
      sw: {
        os: {
          debian: [ contract1.raw, contract2.raw ],
          fedora: [ contract3.raw, contract4.raw ]
        }
      }
    }
  })
})
