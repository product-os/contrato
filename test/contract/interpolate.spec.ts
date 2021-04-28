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

ava('should build missing templates', (test) => {
  const contract = new Contract({
    name: 'Debian {{this.data.codename}}',
    slug: 'debian',
    version: 'wheezy',
    type: 'sw.os',
    data: {
      url: 'https://contracts.org/downloads/{{this.type}}/{{this.slug}}/{{this.version}}.tar.gz'
    }
  })

  contract.raw.data.codename = 'Wheezy'
  contract.interpolate()

  test.deepEqual(contract, new Contract({
    name: 'Debian Wheezy',
    slug: 'debian',
    version: 'wheezy',
    type: 'sw.os',
    data: {
      codename: 'Wheezy',
      url: 'https://contracts.org/downloads/sw.os/debian/wheezy.tar.gz'
    }
  }))
})

ava('should not rehash the contract if the rehash option is set to false', (test) => {
  const contract = new Contract({
    name: 'Debian {{this.data.codename}}',
    slug: 'debian',
    version: 'wheezy',
    type: 'sw.os',
    data: {
      url: 'https://contracts.org/downloads/{{this.type}}/{{this.slug}}/{{this.version}}.tar.gz'
    }
  })

  const hash = contract.metadata.hash

  contract.raw.data.codename = 'Wheezy'
  contract.interpolate({
    rehash: false
  })

  test.deepEqual(contract.raw, {
    name: 'Debian Wheezy',
    slug: 'debian',
    version: 'wheezy',
    type: 'sw.os',
    data: {
      codename: 'Wheezy',
      url: 'https://contracts.org/downloads/sw.os/debian/wheezy.tar.gz'
    }
  })

  test.is(contract.metadata.hash, hash)
})

ava('should return the contract instance', (test) => {
  const contract = new Contract({
    name: 'Debian {{this.data.codename}}',
    slug: 'debian',
    version: 'wheezy',
    type: 'sw.os',
    data: {
      url: 'https://contracts.org/downloads/{{this.type}}/{{this.slug}}/{{this.version}}.tar.gz'
    }
  })

  test.deepEqual(contract.interpolate(), contract)
})

ava('should not perform interpolation on children', (test) => {
  const contract = new Contract({
    slug: 'debian',
    version: 'wheezy',
    type: 'sw.os',
    children: {
      foo: {
        bar: {
          slug: '{{this.version}}-child',
          type: 'foo.bar'
        }
      }
    }
  })

  test.deepEqual(contract.interpolate().raw, {
    slug: 'debian',
    version: 'wheezy',
    type: 'sw.os',
    children: {
      foo: {
        bar: {
          slug: '{{this.version}}-child',
          type: 'foo.bar'
        }
      }
    }
  })
})
