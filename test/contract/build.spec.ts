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

ava('should build contract templates', (test) => {
  const contracts = Contract.build({
    name: 'Debian {{this.data.codename}}',
    slug: 'debian',
    version: 'wheezy',
    type: 'sw.os',
    data: {
      codename: 'Wheezy',
      url: 'https://contracts.org/downloads/{{this.type}}/{{this.slug}}/{{this.version}}.tar.gz'
    }
  })

  test.deepEqual(contracts, [
    new Contract({
      name: 'Debian Wheezy',
      slug: 'debian',
      version: 'wheezy',
      type: 'sw.os',
      data: {
        codename: 'Wheezy',
        url: 'https://contracts.org/downloads/sw.os/debian/wheezy.tar.gz'
      }
    })
  ])
})

ava('should support slug and type templates', (test) => {
  const contracts = Contract.build({
    name: 'Debian Wheezy',
    slug: '{{this.data.slug}}',
    version: 'wheezy',
    type: '{{this.data.type}}',
    data: {
      slug: 'debian',
      type: 'sw.os'
    }
  })

  test.deepEqual(contracts, [
    new Contract({
      name: 'Debian Wheezy',
      slug: 'debian',
      version: 'wheezy',
      type: 'sw.os',
      data: {
        slug: 'debian',
        type: 'sw.os'
      }
    })
  ])
})

ava('should expand contract variants', (test) => {
  const contracts = Contract.build({
    slug: 'debian',
    type: 'sw.os',
    variants: [
      {
        version: 'wheezy'
      },
      {
        version: 'jessie'
      },
      {
        version: 'sid'
      }
    ]
  })

  test.deepEqual(contracts, [
    new Contract({
      slug: 'debian',
      version: 'wheezy',
      type: 'sw.os'
    }),
    new Contract({
      slug: 'debian',
      version: 'jessie',
      type: 'sw.os'
    }),
    new Contract({
      slug: 'debian',
      version: 'sid',
      type: 'sw.os'
    })
  ])
})

ava('should build contracts with variants and templates', (test) => {
  const contracts = Contract.build({
    name: 'debian {{this.version}}',
    slug: 'debian',
    type: 'sw.os',
    variants: [
      {
        version: 'wheezy'
      },
      {
        version: 'jessie'
      },
      {
        version: 'sid'
      }
    ]
  })

  test.deepEqual(contracts, [
    new Contract({
      name: 'debian wheezy',
      slug: 'debian',
      version: 'wheezy',
      type: 'sw.os'
    }),
    new Contract({
      name: 'debian jessie',
      slug: 'debian',
      version: 'jessie',
      type: 'sw.os'
    }),
    new Contract({
      name: 'debian sid',
      slug: 'debian',
      version: 'sid',
      type: 'sw.os'
    })
  ])
})

ava('should expand contract aliases', (test) => {
  const contracts = Contract.build({
    slug: 'debian',
    type: 'sw.os',
    version: 'jessie',
    aliases: [ 'foo', 'bar' ]
  })

  test.deepEqual(contracts, [
    new Contract({
      slug: 'foo',
      version: 'jessie',
      type: 'sw.os',
      canonicalSlug: 'debian'
    }),
    new Contract({
      slug: 'bar',
      version: 'jessie',
      type: 'sw.os',
      canonicalSlug: 'debian'
    }),
    new Contract({
      slug: 'debian',
      version: 'jessie',
      type: 'sw.os'
    })
  ])
})

ava('should build contracts with variants and aliases', (test) => {
  const contracts = Contract.build({
    name: 'debian {{this.version}}',
    slug: 'debian',
    type: 'sw.os',
    variants: [
      {
        version: 'wheezy'
      },
      {
        version: 'jessie'
      }
    ],
    aliases: [ 'foo', 'bar' ]
  })

  test.deepEqual(contracts, [
    new Contract({
      name: 'debian wheezy',
      slug: 'foo',
      type: 'sw.os',
      version: 'wheezy',
      canonicalSlug: 'debian'
    }),
    new Contract({
      name: 'debian wheezy',
      slug: 'bar',
      type: 'sw.os',
      version: 'wheezy',
      canonicalSlug: 'debian'
    }),
    new Contract({
      name: 'debian wheezy',
      slug: 'debian',
      version: 'wheezy',
      type: 'sw.os'
    }),
    new Contract({
      name: 'debian jessie',
      slug: 'foo',
      type: 'sw.os',
      version: 'jessie',
      canonicalSlug: 'debian'
    }),
    new Contract({
      name: 'debian jessie',
      slug: 'bar',
      type: 'sw.os',
      version: 'jessie',
      canonicalSlug: 'debian'
    }),
    new Contract({
      name: 'debian jessie',
      slug: 'debian',
      version: 'jessie',
      type: 'sw.os'
    })
  ])
})
