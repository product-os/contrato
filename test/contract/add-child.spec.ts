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

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Contract'.
const Contract = require('../../lib/contract')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MatcherCac... Remove this comment to see the full error message
const MatcherCache = require('../../lib/matcher-cache')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CONTRACTS'... Remove this comment to see the full error message
const CONTRACTS = require('../contracts.json')

ava('should add a contract to a contract without children', (test) => {
  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  container.addChild(contract1)

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

ava('should add two contracts of different types', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object)

  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChild(contract1)
  container.addChild(contract2)

  test.deepEqual(container.metadata.children, {
    typeMatchers: {},
    searchCache: new MatcherCache(),
    types: new Set([ 'sw.os', 'sw.blob' ]),
    byType: {
      'sw.os': new Set([ contract1.metadata.hash ]),
      'sw.blob': new Set([ contract2.metadata.hash ])
    },
    byTypeSlug: {
      'sw.os': {
        debian: new Set([ contract1.metadata.hash ])
      },
      'sw.blob': {
        nodejs: new Set([ contract2.metadata.hash ])
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
        os: contract1.raw,
        blob: contract2.raw
      }
    }
  })
})

ava('should not add a contract twice', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChild(contract1)

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

ava('should two contracts of same type but different slugs', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.os'].fedora['25'].object)

  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChild(contract1)
  container.addChild(contract2)

  test.deepEqual(container.metadata.children, {
    typeMatchers: {},
    searchCache: new MatcherCache(),
    types: new Set([ 'sw.os' ]),
    byType: {
      'sw.os': new Set([ contract1.metadata.hash, contract2.metadata.hash ])
    },
    byTypeSlug: {
      'sw.os': {
        debian: new Set([ contract1.metadata.hash ]),
        fedora: new Set([ contract2.metadata.hash ])
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
          debian: contract1.raw,
          fedora: contract2.raw
        }
      }
    }
  })
})

ava('should add a new version of an existing contract', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.os'].debian.jessie.object)

  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChild(contract1)
  container.addChild(contract2)

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
          debian: [
            contract1.raw,
            contract2.raw
          ]
        }
      }
    }
  })
})

ava('should add two new versions of an existing contract', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.os'].debian.jessie.object)
  const contract3 = new Contract(CONTRACTS['sw.os'].debian.sid.object)

  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChild(contract1)
  container.addChild(contract2)
  container.addChild(contract3)

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
          contract2.metadata.hash,
          contract3.metadata.hash
        ])
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
          debian: [
            contract1.raw,
            contract2.raw,
            contract3.raw
          ]
        }
      }
    }
  })
})

ava('should return the instance', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  test.deepEqual(container.addChild(contract1), container)
})

ava('should re-hash the parent contract', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  const hash = container.metadata.hash
  container.addChild(contract1)
  test.not(container.metadata.hash, hash)
})

ava('should not re-hash the parent contract if the rehash option is false', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  const hash = container.metadata.hash
  container.addChild(contract1, {
    rehash: false
  })

  test.is(container.metadata.hash, hash)
})
