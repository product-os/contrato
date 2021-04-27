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
const variants = require('../../lib/variants')

ava('should build a contract with no variants', (test) => {
  test.deepEqual(variants.build({
    slug: 'debian',
    type: 'distro',
    name: 'Debian'
  }), [
    {
      slug: 'debian',
      type: 'distro',
      name: 'Debian'
    }
  ])
})

ava('should build a contract with empty variants', (test) => {
  test.deepEqual(variants.build({
    slug: 'debian',
    type: 'distro',
    name: 'Debian',
    variants: []
  }), [
    {
      slug: 'debian',
      type: 'distro',
      name: 'Debian'
    }
  ])
})

ava('should build a contract with two variants', (test) => {
  test.deepEqual(variants.build({
    slug: 'nodejs_{{data.arch}}',
    type: 'blob',
    name: 'Node.js',
    data: {
      libc: 'musl-libc'
    },
    variants: [
      {
        data: {
          arch: 'amd64'
        },
        requires: [
          {
            type: 'arch.sw',
            slug: 'amd64'
          }
        ]
      },
      {
        data: {
          arch: 'i386'
        },
        requires: [
          {
            type: 'arch.sw',
            slug: 'i386'
          }
        ]
      }
    ]
  }), [
    {
      slug: 'nodejs_{{data.arch}}',
      type: 'blob',
      name: 'Node.js',
      requires: [
        {
          type: 'arch.sw',
          slug: 'amd64'
        }
      ],
      data: {
        arch: 'amd64',
        libc: 'musl-libc'
      }
    },
    {
      slug: 'nodejs_{{data.arch}}',
      type: 'blob',
      name: 'Node.js',
      requires: [
        {
          type: 'arch.sw',
          slug: 'i386'
        }
      ],
      data: {
        arch: 'i386',
        libc: 'musl-libc'
      }
    }
  ])
})

ava('should supported nested variants', (test) => {
  test.deepEqual(variants.build({
    slug: 'nodejs_{{data.arch}}',
    type: 'blob',
    name: 'Node.js',
    data: {
      libc: 'musl-libc'
    },
    variants: [
      {
        data: {
          arch: 'amd64'
        },
        requires: [
          {
            type: 'arch.sw',
            slug: 'amd64'
          }
        ],
        variants: [
          {
            version: '6.3.0'
          },
          {
            version: '6.4.0'
          }
        ]
      },
      {
        data: {
          arch: 'i386'
        },
        requires: [
          {
            type: 'arch.sw',
            slug: 'i386'
          }
        ],
        variants: [
          {
            version: '6.3.0'
          }
        ]
      }
    ]
  }), [
    {
      slug: 'nodejs_{{data.arch}}',
      type: 'blob',
      version: '6.3.0',
      name: 'Node.js',
      requires: [
        {
          type: 'arch.sw',
          slug: 'amd64'
        }
      ],
      data: {
        arch: 'amd64',
        libc: 'musl-libc'
      }
    },
    {
      slug: 'nodejs_{{data.arch}}',
      type: 'blob',
      version: '6.4.0',
      name: 'Node.js',
      requires: [
        {
          type: 'arch.sw',
          slug: 'amd64'
        }
      ],
      data: {
        arch: 'amd64',
        libc: 'musl-libc'
      }
    },
    {
      slug: 'nodejs_{{data.arch}}',
      type: 'blob',
      version: '6.3.0',
      name: 'Node.js',
      requires: [
        {
          type: 'arch.sw',
          slug: 'i386'
        }
      ],
      data: {
        arch: 'i386',
        libc: 'musl-libc'
      }
    }
  ])
})

ava('should merge arrays correctly', (test) => {
  test.deepEqual(variants.build({
    slug: 'foo',
    type: 'blob',
    name: 'Foo',
    requires: [
      {
        type: 'bar',
        slug: 'baz'
      }
    ],
    variants: [
      {
        requires: [
          {
            type: 'arch.sw',
            slug: 'amd64'
          }
        ]
      },
      {
        requires: [
          {
            type: 'arch.sw',
            slug: 'i386'
          }
        ]
      }
    ]
  }), [
    {
      slug: 'foo',
      type: 'blob',
      name: 'Foo',
      requires: [
        {
          type: 'bar',
          slug: 'baz'
        },
        {
          type: 'arch.sw',
          slug: 'amd64'
        }
      ]
    },
    {
      slug: 'foo',
      type: 'blob',
      name: 'Foo',
      requires: [
        {
          type: 'bar',
          slug: 'baz'
        },
        {
          type: 'arch.sw',
          slug: 'i386'
        }
      ]
    }
  ])
})
