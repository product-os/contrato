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

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MatcherCac... Remove this comment to see the full error message
const MatcherCache = require('../../lib/matcher-cache')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Contract'.
const Contract = require('../../lib/contract')

ava('should remove all specified types from the cache', (test) => {
  const cache = new MatcherCache()

  const matcher1 = Contract.createMatcher({
    type: 'sw.os',
    slug: 'debian'
  })

  const matcher2 = Contract.createMatcher({
    type: 'sw.os',
    slug: 'fedora'
  })

  const matcher3 = Contract.createMatcher({
    type: 'sw.stack',
    slug: 'nodejs'
  })

  cache.add(matcher1, true)
  cache.add(matcher2, false)
  cache.add(matcher3, true)

  cache.resetType('sw.os')

  test.deepEqual(cache.data, {
    'sw.stack': {
      [matcher3.metadata.hash]: {
        value: true,
        matcher: matcher3
      }
    }
  })
})

ava('should do nothing if the type does not exist', (test) => {
  const cache = new MatcherCache()

  const matcher1 = Contract.createMatcher({
    type: 'sw.os',
    slug: 'debian'
  })

  const matcher2 = Contract.createMatcher({
    type: 'sw.os',
    slug: 'fedora'
  })

  const matcher3 = Contract.createMatcher({
    type: 'sw.stack',
    slug: 'nodejs'
  })

  cache.add(matcher1, true)
  cache.add(matcher2, false)
  cache.add(matcher3, true)

  cache.resetType('foobar')

  test.deepEqual(cache.data, {
    'sw.os': {
      [matcher1.metadata.hash]: {
        value: true,
        matcher: matcher1
      },
      [matcher2.metadata.hash]: {
        value: false,
        matcher: matcher2
      }
    },
    'sw.stack': {
      [matcher3.metadata.hash]: {
        value: true,
        matcher: matcher3
      }
    }
  })
})
