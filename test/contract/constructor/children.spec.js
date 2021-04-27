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
const MatcherCache = require('../../../lib/matcher-cache')
const Contract = require('../../../lib/contract')

ava('should take a contract with a single child', (test) => {
  const contract = new Contract({
    type: 'misc.collection',
    slug: 'my-collection',
    children: {
      arch: {
        sw: {
          type: 'arch.sw',
          name: 'armv7hf',
          slug: 'armv7hf'
        }
      }
    }
  })

  test.deepEqual(contract.metadata.children, {
    typeMatchers: {},
    searchCache: new MatcherCache(),
    types: new Set([ 'arch.sw' ]),
    byType: {
      'arch.sw': new Set([ 'e3d3b7f2e5820db4b45975380a3f467bc2ff2999' ])
    },
    byTypeSlug: {
      'arch.sw': {
        armv7hf: new Set([ 'e3d3b7f2e5820db4b45975380a3f467bc2ff2999' ])
      }
    },
    map: {
      e3d3b7f2e5820db4b45975380a3f467bc2ff2999: new Contract({
        type: 'arch.sw',
        name: 'armv7hf',
        slug: 'armv7hf'
      })
    }
  })

  test.deepEqual(contract.raw, {
    type: 'misc.collection',
    slug: 'my-collection',
    children: {
      arch: {
        sw: {
          type: 'arch.sw',
          name: 'armv7hf',
          slug: 'armv7hf'
        }
      }
    }
  })

  test.deepEqual(new Contract(contract.raw), contract)
})

ava('should take a contract with two children of the same type', (test) => {
  const contract = new Contract({
    type: 'misc.collection',
    slug: 'my-collection',
    children: {
      arch: {
        sw: {
          armv7hf: {
            type: 'arch.sw',
            name: 'armv7hf',
            slug: 'armv7hf'
          },
          armel: {
            type: 'arch.sw',
            name: 'armel',
            slug: 'armel'
          }
        }
      }
    }
  })

  test.deepEqual(contract.metadata.children, {
    typeMatchers: {},
    searchCache: new MatcherCache(),
    types: new Set([ 'arch.sw' ]),
    byType: {
      'arch.sw': new Set([
        'e3d3b7f2e5820db4b45975380a3f467bc2ff2999',
        '6e26947f07bcacc28733ef81eea2d33579c5502e'
      ])
    },
    byTypeSlug: {
      'arch.sw': {
        armv7hf: new Set([ 'e3d3b7f2e5820db4b45975380a3f467bc2ff2999' ]),
        armel: new Set([ '6e26947f07bcacc28733ef81eea2d33579c5502e' ])
      }
    },
    map: {
      e3d3b7f2e5820db4b45975380a3f467bc2ff2999: new Contract({
        type: 'arch.sw',
        name: 'armv7hf',
        slug: 'armv7hf'
      }),
      '6e26947f07bcacc28733ef81eea2d33579c5502e': new Contract({
        type: 'arch.sw',
        name: 'armel',
        slug: 'armel'
      })
    }
  })

  test.deepEqual(contract.raw, {
    type: 'misc.collection',
    slug: 'my-collection',
    children: {
      arch: {
        sw: {
          armv7hf: {
            type: 'arch.sw',
            name: 'armv7hf',
            slug: 'armv7hf'
          },
          armel: {
            type: 'arch.sw',
            name: 'armel',
            slug: 'armel'
          }
        }
      }
    }
  })

  test.deepEqual(new Contract(contract.raw), contract)
})

ava('should take a contract with two children of the same type and slug', (test) => {
  const contract = new Contract({
    type: 'misc.collection',
    slug: 'my-collection',
    children: {
      sw: {
        distro: {
          debian: [
            {
              type: 'sw.distro',
              name: 'debian',
              version: 'wheezy',
              slug: 'debian'
            },
            {
              type: 'sw.distro',
              name: 'debian',
              version: 'jessie',
              slug: 'debian'
            }
          ]
        }
      }
    }
  })

  test.deepEqual(contract.metadata.children, {
    typeMatchers: {},
    searchCache: new MatcherCache(),
    types: new Set([ 'sw.distro' ]),
    byType: {
      'sw.distro': new Set([
        '73adf497b1e8cde552e3be4eab317032f8dd65a0',
        '91c4f16ff328631011d49d2edc654cf3d9a36c75'
      ])
    },
    byTypeSlug: {
      'sw.distro': {
        debian: new Set([
          '73adf497b1e8cde552e3be4eab317032f8dd65a0',
          '91c4f16ff328631011d49d2edc654cf3d9a36c75'
        ])
      }
    },
    map: {
      '73adf497b1e8cde552e3be4eab317032f8dd65a0': new Contract({
        type: 'sw.distro',
        name: 'debian',
        version: 'wheezy',
        slug: 'debian'
      }),
      '91c4f16ff328631011d49d2edc654cf3d9a36c75': new Contract({
        type: 'sw.distro',
        name: 'debian',
        version: 'jessie',
        slug: 'debian'
      })
    }
  })

  test.deepEqual(contract.raw, {
    type: 'misc.collection',
    slug: 'my-collection',
    children: {
      sw: {
        distro: {
          debian: [
            {
              type: 'sw.distro',
              name: 'debian',
              version: 'wheezy',
              slug: 'debian'
            },
            {
              type: 'sw.distro',
              name: 'debian',
              version: 'jessie',
              slug: 'debian'
            }
          ]
        }
      }
    }
  })

  test.deepEqual(new Contract(contract.raw), contract)
})

ava('should take a contract with two children of different types', (test) => {
  const contract = new Contract({
    type: 'misc.collection',
    slug: 'my-collection',
    children: {
      arch: {
        sw: {
          type: 'arch.sw',
          name: 'armv7hf',
          slug: 'armv7hf'
        }
      },
      sw: {
        distro: {
          type: 'sw.distro',
          name: 'debian',
          version: 'wheezy',
          slug: 'debian'
        }
      }
    }
  })

  test.deepEqual(contract.metadata.children, {
    typeMatchers: {},
    searchCache: new MatcherCache(),
    types: new Set([ 'arch.sw', 'sw.distro' ]),
    byType: {
      'arch.sw': new Set([ 'e3d3b7f2e5820db4b45975380a3f467bc2ff2999' ]),
      'sw.distro': new Set([ '73adf497b1e8cde552e3be4eab317032f8dd65a0' ])
    },
    byTypeSlug: {
      'arch.sw': {
        armv7hf: new Set([ 'e3d3b7f2e5820db4b45975380a3f467bc2ff2999' ])
      },
      'sw.distro': {
        debian: new Set([ '73adf497b1e8cde552e3be4eab317032f8dd65a0' ])
      }
    },
    map: {
      e3d3b7f2e5820db4b45975380a3f467bc2ff2999: new Contract({
        type: 'arch.sw',
        name: 'armv7hf',
        slug: 'armv7hf'
      }),
      '73adf497b1e8cde552e3be4eab317032f8dd65a0': new Contract({
        type: 'sw.distro',
        name: 'debian',
        version: 'wheezy',
        slug: 'debian'
      })
    }
  })

  test.deepEqual(contract.raw, {
    type: 'misc.collection',
    slug: 'my-collection',
    children: {
      arch: {
        sw: {
          type: 'arch.sw',
          name: 'armv7hf',
          slug: 'armv7hf'
        }
      },
      sw: {
        distro: {
          type: 'sw.distro',
          name: 'debian',
          version: 'wheezy',
          slug: 'debian'
        }
      }
    }
  })

  test.deepEqual(new Contract(contract.raw), contract)
})
