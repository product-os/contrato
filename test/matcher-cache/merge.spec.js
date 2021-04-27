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
const MatcherCache = require('../../lib/matcher-cache')
const Contract = require('../../lib/contract')

ava('should merge two empty caches', (test) => {
  const cache1 = new MatcherCache()
  const cache2 = new MatcherCache()
  cache1.merge(cache2)
  test.deepEqual(cache1.data, {})
})

ava('should merge a non empty cache with one type into an empty cache', (test) => {
  const cache1 = new MatcherCache()
  const cache2 = new MatcherCache()

  const matcher1 = Contract.createMatcher({
    type: 'sw.os',
    slug: 'debian'
  })

  const matcher2 = Contract.createMatcher({
    type: 'sw.os',
    slug: 'fedora'
  })

  cache2.add(matcher1, true)
  cache2.add(matcher2, true)

  cache1.merge(cache2)

  test.deepEqual(cache1.data, {
    'sw.os': {
      [matcher1.metadata.hash]: {
        value: true,
        matcher: matcher1
      },
      [matcher2.metadata.hash]: {
        value: true,
        matcher: matcher2
      }
    }
  })
})

ava('should merge a non empty cache with two types into an empty cache', (test) => {
  const cache1 = new MatcherCache()
  const cache2 = new MatcherCache()

  const matcher1 = Contract.createMatcher({
    type: 'sw.os',
    slug: 'debian'
  })

  const matcher2 = Contract.createMatcher({
    type: 'sw.blob',
    slug: 'nodejs'
  })

  cache2.add(matcher1, true)
  cache2.add(matcher2, true)

  cache1.merge(cache2)

  test.deepEqual(cache1.data, {
    'sw.os': {
      [matcher1.metadata.hash]: {
        value: true,
        matcher: matcher1
      }
    },
    'sw.blob': {
      [matcher2.metadata.hash]: {
        value: true,
        matcher: matcher2
      }
    }
  })
})

ava('should merge two non empty caches with disjoint types', (test) => {
  const cache1 = new MatcherCache()
  const cache2 = new MatcherCache()

  const matcher1 = Contract.createMatcher({
    type: 'sw.os',
    slug: 'debian'
  })

  const matcher2 = Contract.createMatcher({
    type: 'sw.blob',
    slug: 'nodejs'
  })

  cache1.add(matcher1, true)
  cache2.add(matcher2, true)

  cache1.merge(cache2)

  test.deepEqual(cache1.data, {
    'sw.os': {
      [matcher1.metadata.hash]: {
        value: true,
        matcher: matcher1
      }
    },
    'sw.blob': {
      [matcher2.metadata.hash]: {
        value: true,
        matcher: matcher2
      }
    }
  })
})

ava('should omit types in common', (test) => {
  const cache1 = new MatcherCache()
  const cache2 = new MatcherCache()

  const matcher1 = Contract.createMatcher({
    type: 'sw.os',
    slug: 'debian'
  })

  const matcher2 = Contract.createMatcher({
    type: 'sw.blob',
    slug: 'nodejs'
  })

  const matcher3 = Contract.createMatcher({
    type: 'sw.os',
    slug: 'fedora'
  })

  cache1.add(matcher1, true)
  cache2.add(matcher2, true)
  cache2.add(matcher3, true)

  cache1.merge(cache2)

  test.deepEqual(cache1.data, {
    'sw.blob': {
      [matcher2.metadata.hash]: {
        value: true,
        matcher: matcher2
      }
    }
  })
})

ava('should return the instance', (test) => {
  const cache1 = new MatcherCache()
  const cache2 = new MatcherCache()

  const matcher1 = Contract.createMatcher({
    type: 'sw.os',
    slug: 'debian'
  })

  const matcher2 = Contract.createMatcher({
    type: 'sw.blob',
    slug: 'nodejs'
  })

  const matcher3 = Contract.createMatcher({
    type: 'sw.os',
    slug: 'fedora'
  })

  cache1.add(matcher1, true)
  cache2.add(matcher2, true)
  cache2.add(matcher3, true)

  test.deepEqual(cache1.merge(cache2), cache1)
})
