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

ava('should return true given an empty contract and a contract without requirements', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  test.true(contract.satisfiesChildContract(new Contract({
    type: 'test',
    slug: 'foo',
    name: 'Foo',
    version: '1.2.3'
  })))
})

ava('should return false given an empty contract and a contract with requirements', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  test.false(contract.satisfiesChildContract(new Contract({
    type: 'test',
    slug: 'foo',
    name: 'Foo',
    version: '1.2.3',
    requires: [
      {
        type: 'sw.arch',
        slug: 'amd64'
      }
    ]
  })))
})

ava('should return true given a contract without requirements', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  contract.addChildren([
    new Contract(CONTRACTS['sw.os'].debian.wheezy.object),
    new Contract(CONTRACTS['sw.os'].debian.jessie.object)
  ])

  test.true(contract.satisfiesChildContract(new Contract({
    type: 'test',
    slug: 'foo',
    name: 'Foo',
    version: '1.2.3'
  })))
})

ava('should return true given one fulfilled requirement', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  contract.addChildren([
    new Contract(CONTRACTS['sw.os'].debian.wheezy.object),
    new Contract(CONTRACTS['sw.os'].debian.jessie.object)
  ])

  test.true(contract.satisfiesChildContract(new Contract({
    name: 'Node.js',
    slug: 'nodejs',
    type: 'sw.stack',
    requires: [
      {
        slug: 'debian',
        version: 'wheezy',
        type: 'sw.os'
      }
    ]
  })))
})

ava('should return true given two fulfilled requirements', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  contract.addChildren([
    new Contract(CONTRACTS['sw.os'].debian.wheezy.object),
    new Contract(CONTRACTS['sw.os'].debian.jessie.object),
    new Contract(CONTRACTS['hw.device-type'].artik10.object)
  ])

  test.true(contract.satisfiesChildContract(new Contract({
    name: 'Node.js',
    slug: 'nodejs',
    type: 'sw.stack',
    requires: [
      {
        slug: 'debian',
        version: 'wheezy',
        type: 'sw.os'
      },
      {
        slug: 'artik10',
        type: 'hw.device-type'
      }
    ]
  })))
})

ava('should return false given one unfulfilled requirement', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  contract.addChildren([
    new Contract(CONTRACTS['sw.os'].debian.wheezy.object),
    new Contract(CONTRACTS['sw.os'].debian.jessie.object),
    new Contract(CONTRACTS['hw.device-type'].artik10.object)
  ])

  test.false(contract.satisfiesChildContract(new Contract({
    name: 'Node.js',
    slug: 'nodejs',
    type: 'sw.stack',
    requires: [
      {
        slug: 'void',
        type: 'sw.os'
      }
    ]
  })))
})

ava('should return false given two requirements where one is not fulfilled', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  contract.addChildren([
    new Contract(CONTRACTS['sw.os'].debian.wheezy.object),
    new Contract(CONTRACTS['sw.os'].debian.jessie.object),
    new Contract(CONTRACTS['hw.device-type'].artik10.object)
  ])

  test.false(contract.satisfiesChildContract(new Contract({
    name: 'Node.js',
    slug: 'nodejs',
    type: 'sw.stack',
    requires: [
      {
        slug: 'void',
        type: 'sw.os'
      },
      {
        slug: 'artik10',
        type: 'hw.device-type'
      }
    ]
  })))
})

ava('should return true given no requirements in a disjunction', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  contract.addChildren([
    new Contract(CONTRACTS['sw.os'].debian.wheezy.object),
    new Contract(CONTRACTS['sw.os'].debian.jessie.object),
    new Contract(CONTRACTS['hw.device-type'].artik10.object)
  ])

  test.true(contract.satisfiesChildContract(new Contract({
    name: 'Node.js',
    slug: 'nodejs',
    type: 'sw.stack',
    requires: [
      {
        or: []
      }
    ]
  })))
})

ava('should return false given a partially unfulfilled not operator', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  contract.addChildren([
    new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  ])

  test.false(contract.satisfiesChildContract(new Contract({
    name: 'Node.js',
    slug: 'nodejs',
    type: 'sw.stack',
    requires: [
      {
        not: [
          {
            slug: CONTRACTS['sw.os'].fedora['24'].object.slug,
            type: 'sw.os'
          },
          {
            slug: CONTRACTS['sw.os'].debian.wheezy.object.slug,
            type: 'sw.os'
          }
        ]
      }
    ]
  })))
})

ava('should return false given an unfulfilled not operator', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  contract.addChildren([
    new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  ])

  test.false(contract.satisfiesChildContract(new Contract({
    name: 'Node.js',
    slug: 'nodejs',
    type: 'sw.stack',
    requires: [
      {
        not: [
          {
            slug: CONTRACTS['sw.os'].debian.wheezy.object.slug,
            type: 'sw.os'
          }
        ]
      }
    ]
  })))
})

ava('should return false given a fulfilled not operator', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  contract.addChildren([
    new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  ])

  test.true(contract.satisfiesChildContract(new Contract({
    name: 'Node.js',
    slug: 'nodejs',
    type: 'sw.stack',
    requires: [
      {
        not: [
          {
            slug: 'foo-bar',
            type: 'sw.os'
          }
        ]
      }
    ]
  })))
})

ava('should return true given an empty not operator', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  contract.addChildren([
    new Contract(CONTRACTS['sw.os'].debian.wheezy.object)
  ])

  test.true(contract.satisfiesChildContract(new Contract({
    name: 'Node.js',
    slug: 'nodejs',
    type: 'sw.stack',
    requires: [
      {
        not: []
      }
    ]
  })))
})

ava('should return false given two unfulfilled requirements', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  contract.addChildren([
    new Contract(CONTRACTS['sw.os'].debian.wheezy.object),
    new Contract(CONTRACTS['sw.os'].debian.jessie.object),
    new Contract(CONTRACTS['hw.device-type'].artik10.object)
  ])

  test.false(contract.satisfiesChildContract(new Contract({
    name: 'Node.js',
    slug: 'nodejs',
    type: 'sw.stack',
    requires: [
      {
        slug: 'void',
        type: 'sw.os'
      },
      {
        slug: 'raspberry-pi',
        type: 'hw.device-type'
      }
    ]
  })))
})

ava('should return true given one fulfilled requirement in a disjunction', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  contract.addChildren([
    new Contract(CONTRACTS['sw.os'].debian.wheezy.object),
    new Contract(CONTRACTS['sw.os'].debian.jessie.object),
    new Contract(CONTRACTS['hw.device-type'].artik10.object)
  ])

  test.true(contract.satisfiesChildContract(new Contract({
    name: 'Node.js',
    slug: 'nodejs',
    type: 'sw.stack',
    requires: [
      {
        or: [
          {
            slug: 'debian',
            type: 'sw.os'
          }
        ]
      }
    ]
  })))
})

ava('should return true given one fulfilled and one unfulfilled requirement in a disjunction', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  contract.addChildren([
    new Contract(CONTRACTS['sw.os'].debian.wheezy.object),
    new Contract(CONTRACTS['sw.os'].debian.jessie.object),
    new Contract(CONTRACTS['hw.device-type'].artik10.object)
  ])

  test.true(contract.satisfiesChildContract(new Contract({
    name: 'Node.js',
    slug: 'nodejs',
    type: 'sw.stack',
    requires: [
      {
        or: [
          {
            slug: 'debian',
            type: 'sw.os'
          },
          {
            slug: 'void',
            type: 'sw.os'
          }
        ]
      }
    ]
  })))
})

ava('should return false given one unfulfilled requirement in a disjunction', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  contract.addChildren([
    new Contract(CONTRACTS['sw.os'].debian.wheezy.object),
    new Contract(CONTRACTS['sw.os'].debian.jessie.object),
    new Contract(CONTRACTS['hw.device-type'].artik10.object)
  ])

  test.false(contract.satisfiesChildContract(new Contract({
    name: 'Node.js',
    slug: 'nodejs',
    type: 'stack',
    requires: [
      {
        or: [
          {
            slug: 'void',
            type: 'sw.os'
          }
        ]
      }
    ]
  })))
})

ava('should return false given an empty disjunction and an unfulfilled requirement', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  contract.addChildren([
    new Contract(CONTRACTS['sw.os'].debian.wheezy.object),
    new Contract(CONTRACTS['sw.os'].debian.jessie.object),
    new Contract(CONTRACTS['hw.device-type'].artik10.object)
  ])

  test.false(contract.satisfiesChildContract(new Contract({
    name: 'Node.js',
    slug: 'nodejs',
    type: 'stack',
    requires: [
      {
        or: []
      },
      {
        slug: 'void',
        type: 'sw.os'
      }
    ]
  })))
})

ava('should return false given an fulfilled disjunction and an unfulfilled requirement', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  contract.addChildren([
    new Contract(CONTRACTS['sw.os'].debian.wheezy.object),
    new Contract(CONTRACTS['sw.os'].debian.jessie.object),
    new Contract(CONTRACTS['hw.device-type'].artik10.object)
  ])

  test.false(contract.satisfiesChildContract(new Contract({
    name: 'Node.js',
    slug: 'nodejs',
    type: 'stack',
    requires: [
      {
        or: [
          {
            type: 'sw.os',
            slug: 'void'
          },
          {
            type: 'sw.os',
            slug: 'debian'
          }
        ]
      },
      {
        slug: 'raspberry-pi',
        type: 'hw.device-type'
      }
    ]
  })))
})

ava('should be able to specify a single type', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  contract.addChildren([
    new Contract(CONTRACTS['sw.os'].debian.wheezy.object),
    new Contract(CONTRACTS['sw.os'].debian.jessie.object),
    new Contract(CONTRACTS['hw.device-type'].artik10.object)
  ])

  test.true(contract.satisfiesChildContract(new Contract({
    name: 'Node.js',
    slug: 'nodejs',
    type: 'sw.stack',
    requires: [
      {
        slug: 'debian',
        type: 'sw.os'
      },
      {
        slug: 'hello',
        type: 'test'
      }
    ]
  }), {
    types: new Set([ 'sw.os' ])
  }))
})

ava('should be able to specify multiple types', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  contract.addChildren([
    new Contract(CONTRACTS['sw.os'].debian.wheezy.object),
    new Contract(CONTRACTS['sw.os'].debian.jessie.object),
    new Contract(CONTRACTS['hw.device-type'].artik10.object)
  ])

  test.true(contract.satisfiesChildContract(new Contract({
    name: 'Node.js',
    slug: 'nodejs',
    type: 'sw.stack',
    requires: [
      {
        slug: 'debian',
        type: 'sw.os'
      },
      {
        or: [
          {
            type: 'hw.device-type',
            slug: 'artik10'
          },
          {
            type: 'hw.device-type',
            slug: 'raspberry-pi'
          }
        ]
      },
      {
        slug: 'hello',
        type: 'test'
      }
    ]
  }), {
    types: new Set([ 'sw.os', 'hw.device-type' ])
  }))
})

ava('should return false given one unfulfilled requirement selected type', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  contract.addChildren([
    new Contract(CONTRACTS['sw.os'].debian.wheezy.object),
    new Contract(CONTRACTS['sw.os'].debian.jessie.object),
    new Contract(CONTRACTS['hw.device-type'].artik10.object)
  ])

  test.false(contract.satisfiesChildContract(new Contract({
    name: 'Node.js',
    slug: 'nodejs',
    type: 'stack',
    requires: [
      {
        slug: 'void',
        type: 'sw.os'
      }
    ]
  }), {
    types: new Set([ 'sw.os' ])
  }))
})

ava('should return true given one unfulfilled requirement in a disjunction of a non-selected type', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  contract.addChildren([
    new Contract(CONTRACTS['hw.device-type'].artik10.object)
  ])

  test.true(contract.satisfiesChildContract(new Contract({
    name: 'Debian',
    slug: 'debian',
    type: 'sw.os',
    requires: [
      {
        or: [
          {
            type: 'hw.device-type',
            slug: 'intel-edison'
          },
          {
            type: 'hw.device-type',
            slug: 'raspberry-pi'
          }
        ]
      }
    ]
  }), {
    types: new Set([ 'arch.sw' ])
  }))
})

ava('should return true given two fulfilled requirements from a context with a composite contract', (test) => {
  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  const contract1 = new Contract({
    type: 'meta.composite',
    slug: 'test'
  })

  contract1.addChildren([
    new Contract({
      type: 'sw.os',
      slug: 'debian',
      version: 'wheezy'
    }),
    new Contract({
      type: 'arch.sw',
      slug: 'amd64',
      version: '1'
    })
  ])

  container.addChild(contract1)

  test.true(container.satisfiesChildContract(new Contract({
    name: 'Node.js',
    slug: 'nodejs',
    type: 'sw.stack',
    requires: [
      {
        slug: 'debian',
        type: 'sw.os'
      },
      {
        or: [
          {
            slug: 'amd64',
            type: 'arch.sw'
          },
          {
            slug: 'i386',
            type: 'arch.sw'
          }
        ]
      }
    ]
  })))
})

ava('should return false given one unfulfilled requirement from a context with a composite contract', (test) => {
  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  const contract1 = new Contract({
    type: 'meta.composite',
    slug: 'test'
  })

  contract1.addChildren([
    new Contract({
      type: 'sw.os',
      slug: 'debian',
      version: 'wheezy'
    }),
    new Contract({
      type: 'arch.sw',
      slug: 'amd64',
      version: '1'
    })
  ])

  container.addChild(contract1)

  test.false(container.satisfiesChildContract(new Contract({
    name: 'Node.js',
    slug: 'nodejs',
    type: 'sw.stack',
    requires: [
      {
        slug: 'fedora',
        type: 'sw.os'
      },
      {
        or: [
          {
            slug: 'amd64',
            type: 'arch.sw'
          },
          {
            slug: 'i386',
            type: 'arch.sw'
          }
        ]
      }
    ]
  })))
})

ava('should return true given one ignored unfulfilled requirement ' +
         'on a context with a composite contract', (test) => {
  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  const contract1 = new Contract({
    type: 'meta.composite',
    slug: 'test'
  })

  contract1.addChildren([
    new Contract({
      type: 'sw.os',
      slug: 'debian',
      version: 'wheezy'
    }),
    new Contract({
      type: 'arch.sw',
      slug: 'amd64',
      version: '1'
    })
  ])

  container.addChild(contract1)

  test.true(container.satisfiesChildContract(new Contract({
    name: 'Node.js',
    slug: 'nodejs',
    type: 'sw.stack',
    requires: [
      {
        slug: 'fedora',
        type: 'sw.os'
      },
      {
        or: [
          {
            slug: 'amd64',
            type: 'arch.sw'
          },
          {
            slug: 'i386',
            type: 'arch.sw'
          }
        ]
      }
    ]
  }), {
    types: new Set([ 'arch.sw' ])
  }))
})

ava('should return true given a fulfilled context as an argument', (test) => {
  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  const contract1 = new Contract({
    type: 'arch.sw',
    slug: 'amd64'
  })

  const contract2 = new Contract({
    type: 'meta.composite',
    slug: 'test'
  })

  contract2.addChildren([
    new Contract({
      type: 'sw.os',
      slug: 'debian',
      version: 'wheezy',
      requires: [
        {
          type: 'arch.sw',
          slug: 'amd64'
        }
      ]
    })
  ])

  container.addChild(contract1)

  test.true(container.satisfiesChildContract(contract2))
})

ava('should return false given a unfulfilled context as an argument', (test) => {
  const container = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  const contract1 = new Contract({
    type: 'arch.sw',
    slug: 'amd64'
  })

  const contract2 = new Contract({
    type: 'meta.composite',
    slug: 'test'
  })

  contract2.addChildren([
    new Contract({
      type: 'sw.os',
      slug: 'debian',
      version: 'wheezy',
      requires: [
        {
          type: 'arch.sw',
          slug: 'armv7hf'
        }
      ]
    })
  ])

  container.addChild(contract1)

  test.false(container.satisfiesChildContract(contract2))
})
