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
const Contract = require('../../../lib/contract')
const ObjectSet = require('../../../lib/object-set')

const createContractObjectSet = (contracts) => {
  const set = new ObjectSet()

  for (const contract of contracts) {
    set.add(contract, {
      id: contract.metadata.hash
    })
  }

  return set
}

ava.test('should create a simple contract with empty requirements', (test) => {
  const contract = new Contract({
    type: 'arch.sw',
    name: 'armv7hf',
    slug: 'armv7hf',
    requires: []
  })

  test.deepEqual(contract.metadata.requirements, {
    matchers: {},
    types: new Set(),
    compiled: new ObjectSet()
  })

  test.deepEqual(contract.raw, {
    type: 'arch.sw',
    name: 'armv7hf',
    slug: 'armv7hf',
    requires: []
  })
})

ava.test('should create a contract with a single top level requirement', (test) => {
  const contract = new Contract({
    type: 'arch.sw',
    name: 'armv7hf',
    slug: 'armv7hf',
    requires: [
      {
        type: 'hw.device-type',
        slug: 'raspberry-pi'
      }
    ]
  })

  test.deepEqual(contract.metadata.requirements, {
    matchers: {
      'hw.device-type': createContractObjectSet([
        Contract.createMatcher({
          type: 'hw.device-type',
          slug: 'raspberry-pi'
        })
      ])
    },
    types: new Set([ 'hw.device-type' ]),
    compiled: createContractObjectSet([
      Contract.createMatcher({
        type: 'hw.device-type',
        slug: 'raspberry-pi'
      })
    ])
  })

  test.deepEqual(contract.raw, {
    type: 'arch.sw',
    name: 'armv7hf',
    slug: 'armv7hf',
    requires: [
      {
        type: 'hw.device-type',
        slug: 'raspberry-pi'
      }
    ]
  })
})

ava.test('should ignore duplicate top level requirements matchers', (test) => {
  const contract = new Contract({
    type: 'arch.sw',
    name: 'armv7hf',
    slug: 'armv7hf',
    requires: [
      {
        type: 'hw.device-type',
        slug: 'raspberry-pi'
      },
      {
        type: 'hw.device-type',
        slug: 'raspberry-pi'
      }
    ]
  })

  test.deepEqual(contract.metadata.requirements, {
    matchers: {
      'hw.device-type': createContractObjectSet([
        Contract.createMatcher({
          type: 'hw.device-type',
          slug: 'raspberry-pi'
        })
      ])
    },
    types: new Set([ 'hw.device-type' ]),
    compiled: createContractObjectSet([
      Contract.createMatcher({
        type: 'hw.device-type',
        slug: 'raspberry-pi'
      }),
      Contract.createMatcher({
        type: 'hw.device-type',
        slug: 'raspberry-pi'
      })
    ])
  })

  test.deepEqual(contract.raw, {
    type: 'arch.sw',
    name: 'armv7hf',
    slug: 'armv7hf',
    requires: [
      {
        type: 'hw.device-type',
        slug: 'raspberry-pi'
      },
      {
        type: 'hw.device-type',
        slug: 'raspberry-pi'
      }
    ]
  })
})

ava.test('should create a contract with two top level requirements', (test) => {
  const contract = new Contract({
    type: 'sw.os',
    name: 'Debian',
    slug: 'debian',
    requires: [
      {
        type: 'hw.device-type',
        slug: 'intel-nuc'
      },
      {
        type: 'arch.sw',
        slug: 'amd64'
      }
    ]
  })

  test.deepEqual(contract.metadata.requirements, {
    matchers: {
      'hw.device-type': createContractObjectSet([
        Contract.createMatcher({
          type: 'hw.device-type',
          slug: 'intel-nuc'
        })
      ]),
      'arch.sw': createContractObjectSet([
        Contract.createMatcher({
          type: 'arch.sw',
          slug: 'amd64'
        })
      ])
    },
    types: new Set([ 'hw.device-type', 'arch.sw' ]),
    compiled: createContractObjectSet([
      Contract.createMatcher({
        type: 'hw.device-type',
        slug: 'intel-nuc'
      }),
      Contract.createMatcher({
        type: 'arch.sw',
        slug: 'amd64'
      })
    ])
  })

  test.deepEqual(contract.raw, {
    type: 'sw.os',
    name: 'Debian',
    slug: 'debian',
    requires: [
      {
        type: 'hw.device-type',
        slug: 'intel-nuc'
      },
      {
        type: 'arch.sw',
        slug: 'amd64'
      }
    ]
  })
})

ava.test('should create a contract with a single or requirement', (test) => {
  const contract = new Contract({
    type: 'arch.sw',
    name: 'armv7hf',
    slug: 'armv7hf',
    requires: [
      {
        or: [
          {
            type: 'hw.device-type',
            slug: 'raspberry-pi'
          },
          {
            type: 'hw.device-type',
            slug: 'raspberry-pi2'
          }
        ]
      }
    ]
  })

  test.deepEqual(contract.metadata.requirements, {
    matchers: {
      'hw.device-type': createContractObjectSet([
        Contract.createMatcher({
          type: 'hw.device-type',
          slug: 'raspberry-pi'
        }),
        Contract.createMatcher({
          slug: 'raspberry-pi2',
          type: 'hw.device-type'
        })
      ])
    },
    types: new Set([ 'hw.device-type' ]),
    compiled: createContractObjectSet([
      Contract.createMatcher(createContractObjectSet([
        Contract.createMatcher({
          type: 'hw.device-type',
          slug: 'raspberry-pi'
        }),
        Contract.createMatcher({
          slug: 'raspberry-pi2',
          type: 'hw.device-type'
        })
      ]), {
        operation: 'or'
      })
    ])
  })

  test.deepEqual(contract.raw, {
    type: 'arch.sw',
    name: 'armv7hf',
    slug: 'armv7hf',
    requires: [
      {
        or: [
          {
            type: 'hw.device-type',
            slug: 'raspberry-pi'
          },
          {
            type: 'hw.device-type',
            slug: 'raspberry-pi2'
          }
        ]
      }
    ]
  })
})

ava.test('should ignore duplicate matchers from or requirements', (test) => {
  const contract = new Contract({
    type: 'arch.sw',
    name: 'armv7hf',
    slug: 'armv7hf',
    requires: [
      {
        or: [
          {
            type: 'hw.device-type',
            slug: 'raspberry-pi'
          },
          {
            type: 'hw.device-type',
            slug: 'raspberry-pi'
          }
        ]
      }
    ]
  })

  test.deepEqual(contract.metadata.requirements, {
    matchers: {
      'hw.device-type': createContractObjectSet([
        Contract.createMatcher({
          type: 'hw.device-type',
          slug: 'raspberry-pi'
        })
      ])
    },
    types: new Set([ 'hw.device-type' ]),
    compiled: createContractObjectSet([
      Contract.createMatcher(createContractObjectSet([
        Contract.createMatcher({
          type: 'hw.device-type',
          slug: 'raspberry-pi'
        }),
        Contract.createMatcher({
          type: 'hw.device-type',
          slug: 'raspberry-pi'
        })
      ]), {
        operation: 'or'
      })
    ])
  })

  test.deepEqual(contract.raw, {
    type: 'arch.sw',
    name: 'armv7hf',
    slug: 'armv7hf',
    requires: [
      {
        or: [
          {
            type: 'hw.device-type',
            slug: 'raspberry-pi'
          },
          {
            type: 'hw.device-type',
            slug: 'raspberry-pi'
          }
        ]
      }
    ]
  })
})
