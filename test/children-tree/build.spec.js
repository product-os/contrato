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
const childrenTree = require('../../lib/children-tree')
const CONTRACTS = require('../contracts.json')

ava('should build a tree with one children', (test) => {
  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  container.addChild(contract1)

  container.metadata.children = {
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
  }

  test.deepEqual(childrenTree.build(container), {
    sw: {
      os: contract1.raw
    }
  })
})

ava('should build a tree with two contracts of different types', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.blob'].nodejs['4.8.0'].object)

  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChild(contract1)
  container.addChild(contract2)

  container.metadata.children = {
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
  }

  test.deepEqual(childrenTree.build(container), {
    sw: {
      os: contract1.raw,
      blob: contract2.raw
    }
  })
})

ava('should build a tree with two contracts of the same type', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.os'].fedora['25'].object)

  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChild(contract1)
  container.addChild(contract2)

  container.metadata.children = {
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
  }

  test.deepEqual(childrenTree.build(container), {
    sw: {
      os: {
        debian: contract1.raw,
        fedora: contract2.raw
      }
    }
  })
})

ava('should build a tree with two versions of the same slug', (test) => {
  const contract1 = new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  const contract2 = new Contract(CONTRACTS['sw.os'].debian.jessie.object)

  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChild(contract1)
  container.addChild(contract2)

  container.metadata.children = {
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
  }

  test.deepEqual(childrenTree.build(container), {
    sw: {
      os: {
        debian: [
          contract1.raw,
          contract2.raw
        ]
      }
    }
  })
})

ava('should create a tree of two variants of the same contract', (test) => {
  const contract1 = new Contract({
    type: 'sw.os',
    slug: 'Debian Wheezy',
    version: 'wheezy',
    requires: [
      {
        type: 'arch.sw',
        slug: 'amd64'
      }
    ]
  })

  const contract2 = new Contract({
    type: 'sw.os',
    slug: 'Debian Wheezy',
    version: 'wheezy',
    requires: [
      {
        type: 'arch.sw',
        slug: 'armv7hf'
      }
    ]
  })

  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  container.addChild(contract1)
  container.addChild(contract2)

  container.metadata.children = {
    types: new Set([ 'sw.os' ]),
    byType: {
      'sw.os': new Set([
        contract1.metadata.hash,
        contract2.metadata.hash
      ])
    },
    byTypeSlug: {
      'sw.os': {
        debian: new Set([
          contract1.metadata.hash,
          contract2.metadata.hash
        ])
      }
    },
    map: {
      [contract1.metadata.hash]: contract1,
      [contract2.metadata.hash]: contract2
    }
  }

  test.deepEqual(childrenTree.build(container), {
    sw: {
      os: {
        debian: [ contract1.raw, contract2.raw ]
      }
    }
  })
})
