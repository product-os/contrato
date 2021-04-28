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

ava('should compute the intersection of one type and two contracts with or operators', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  contract.addChildren([
    new Contract({
      type: 'arch.sw',
      slug: 'armel',
      name: 'armel'
    }),
    new Contract({
      type: 'arch.sw',
      slug: 'armv7hf',
      name: 'armv7hf'
    }),
    new Contract({
      type: 'arch.sw',
      slug: 'i386',
      name: 'i386'
    }),
    new Contract({
      type: 'sw.os',
      name: 'Debian Wheezy',
      slug: 'debian',
      version: 'wheezy',
      requires: [
        {
          or: [
            {
              type: 'arch.sw',
              slug: 'armel'
            },
            {
              type: 'arch.sw',
              slug: 'armv7hf'
            }
          ]
        }
      ]
    }),
    new Contract({
      type: 'sw.stack',
      name: 'Node.js {{version}}',
      slug: 'nodejs',
      version: '4.8.0',
      requires: [
        {
          or: [
            {
              type: 'arch.sw',
              slug: 'armv7hf'
            },
            {
              type: 'arch.sw',
              slug: 'i386'
            }
          ]
        }
      ]
    })
  ])

  const contracts = contract.getChildrenCrossReferencedContracts({
    types: new Set([ 'arch.sw' ]),
    from: contract
  })

  test.deepEqual(contracts, [
    new Contract({
      type: 'arch.sw',
      slug: 'armv7hf',
      name: 'armv7hf'
    })
  ])
})

ava('should return nothing if the from contract does not contain the referenced contracts', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  contract.addChildren([
    new Contract({
      type: 'sw.os',
      name: 'Debian Wheezy',
      slug: 'debian',
      version: 'wheezy',
      requires: [
        {
          or: [
            {
              type: 'arch.sw',
              slug: 'armel'
            },
            {
              type: 'arch.sw',
              slug: 'armv7hf'
            }
          ]
        }
      ]
    }),
    new Contract({
      type: 'sw.stack',
      name: 'Node.js {{version}}',
      slug: 'nodejs',
      version: '4.8.0',
      requires: [
        {
          or: [
            {
              type: 'arch.sw',
              slug: 'armv7hf'
            },
            {
              type: 'arch.sw',
              slug: 'i386'
            }
          ]
        }
      ]
    })
  ])

  const references = contract.getChildrenCrossReferencedContracts({
    types: new Set([ 'arch.sw' ]),
    from: contract
  })

  test.deepEqual(references, [])
})

ava('should compute the intersection of more than one type, from more than two contracts', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  contract.addChildren([
    new Contract({
      type: 'arch.sw',
      slug: 'armel',
      name: 'armel'
    }),
    new Contract({
      type: 'arch.sw',
      slug: 'armv7hf',
      name: 'armv7hf'
    }),
    new Contract({
      type: 'arch.sw',
      slug: 'i386',
      name: 'i386'
    }),
    new Contract({
      slug: 'artik10',
      type: 'hw.device-type',
      name: 'Samsung Artik 10'
    }),
    new Contract({
      slug: 'raspberry-pi',
      type: 'hw.device-type',
      name: 'Raspberry Pi (1, Zero, Zero W)'
    }),
    new Contract({
      slug: 'raspberrypi3',
      type: 'hw.device-type',
      name: 'Raspberry Pi 3'
    }),
    new Contract({
      type: 'sw.os',
      name: 'Debian Wheezy',
      slug: 'debian',
      version: 'wheezy',
      requires: [
        {
          or: [
            {
              type: 'arch.sw',
              slug: 'armel'
            },
            {
              type: 'arch.sw',
              slug: 'armv7hf'
            }
          ]
        },
        {
          type: 'hw.device-type',
          slug: 'raspberry-pi'
        }
      ]
    }),
    new Contract({
      type: 'sw.stack',
      name: 'Node.js {{version}}',
      slug: 'nodejs',
      version: '4.8.0',
      requires: [
        {
          or: [
            {
              type: 'arch.sw',
              slug: 'armv7hf'
            },
            {
              type: 'arch.sw',
              slug: 'i386'
            }
          ]
        },
        {
          or: [
            {
              type: 'hw.device-type',
              slug: 'raspberry-pi'
            },
            {
              type: 'hw.device-type',
              slug: 'artik10'
            },
            {
              type: 'hw.device-type',
              slug: 'raspberrypi3'
            }
          ]
        }
      ]
    }),
    new Contract({
      type: 'sw.variant',
      name: 'Slim',
      slug: 'slim',
      requires: [
        {
          type: 'arch.sw',
          slug: 'armv7hf'
        },
        {
          or: [
            {
              type: 'hw.device-type',
              slug: 'raspberry-pi'
            },
            {
              type: 'hw.device-type',
              slug: 'artik10'
            }
          ]
        }
      ]
    })
  ])

  const references = contract.getChildrenCrossReferencedContracts({
    types: new Set([ 'arch.sw', 'hw.device-type' ]),
    from: contract
  })

  test.deepEqual(references, [
    new Contract({
      type: 'arch.sw',
      slug: 'armv7hf',
      name: 'armv7hf'
    }),
    new Contract({
      slug: 'raspberry-pi',
      type: 'hw.device-type',
      name: 'Raspberry Pi (1, Zero, Zero W)'
    })
  ])
})

ava('should return nothing if there is no intersection', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  contract.addChildren([
    new Contract({
      type: 'arch.sw',
      slug: 'armel',
      name: 'armel'
    }),
    new Contract({
      type: 'arch.sw',
      slug: 'armv7hf',
      name: 'armv7hf'
    }),
    new Contract({
      type: 'arch.sw',
      slug: 'i386',
      name: 'i386'
    }),
    new Contract({
      type: 'sw.os',
      name: 'Debian Wheezy',
      slug: 'debian',
      version: 'wheezy',
      requires: [
        {
          or: [
            {
              type: 'arch.sw',
              slug: 'armel'
            },
            {
              type: 'arch.sw',
              slug: 'armv7hf'
            }
          ]
        }
      ]
    }),
    new Contract({
      type: 'sw.stack',
      name: 'Node.js {{version}}',
      slug: 'nodejs',
      version: '4.8.0',
      requires: [
        {
          type: 'arch.sw',
          slug: 'i386'
        }
      ]
    })
  ])

  const references = contract.getChildrenCrossReferencedContracts({
    types: new Set([ 'arch.sw' ]),
    from: contract
  })

  test.deepEqual(references, [])
})

ava('should not discard contracts of a type not defined in another contracts', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  contract.addChildren([
    new Contract({
      type: 'arch.sw',
      slug: 'armv7hf',
      name: 'armv7hf'
    }),
    new Contract({
      slug: 'tini',
      type: 'sw.blob',
      name: 'TINI',
      version: '0.14.0'
    }),
    new Contract({
      type: 'sw.os',
      name: 'Debian Wheezy',
      slug: 'debian',
      version: 'wheezy',
      requires: [
        {
          type: 'sw.blob',
          slug: 'tini'
        },
        {
          type: 'arch.sw',
          slug: 'armv7hf'
        }
      ]
    }),
    new Contract({
      type: 'sw.stack',
      name: 'Node.js {{version}}',
      slug: 'nodejs',
      version: '4.8.0',
      requires: [
        {
          type: 'arch.sw',
          slug: 'armv7hf'
        }
      ]
    })
  ])

  const references = contract.getChildrenCrossReferencedContracts({
    types: new Set([ 'arch.sw', 'sw.blob' ]),
    from: contract
  })

  test.deepEqual(references, [
    new Contract({
      type: 'arch.sw',
      slug: 'armv7hf',
      name: 'armv7hf'
    }),
    new Contract({
      slug: 'tini',
      type: 'sw.blob',
      name: 'TINI',
      version: '0.14.0'
    })
  ])
})
