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

ava.test('should return an empty set if the cache is empty', (test) => {
  const cache = new MatcherCache()
  test.deepEqual(cache.getTypes(), new Set())
})

ava.test('should return a single type if there is only one entry', (test) => {
  const cache = new MatcherCache()

  const matcher1 = Contract.createMatcher({
    type: 'sw.os',
    slug: 'debian'
  })

  cache.add(matcher1, true)

  test.deepEqual(cache.getTypes(), new Set([ 'sw.os' ]))
})

ava.test('should not return duplicated types', (test) => {
  const cache = new MatcherCache()

  const matcher1 = Contract.createMatcher({
    type: 'sw.os',
    slug: 'debian'
  })

  const matcher2 = Contract.createMatcher({
    type: 'sw.os',
    slug: 'fedora'
  })

  cache.add(matcher1, true)
  cache.add(matcher2, false)

  test.deepEqual(cache.getTypes(), new Set([ 'sw.os' ]))
})

ava.test('should return all added types', (test) => {
  const cache = new MatcherCache()

  const matcher1 = Contract.createMatcher({
    type: 'sw.os',
    slug: 'debian'
  })

  const matcher2 = Contract.createMatcher({
    type: 'sw.stack',
    slug: 'nodejs'
  })

  cache.add(matcher1, true)
  cache.add(matcher2, false)

  test.deepEqual(cache.getTypes(), new Set([ 'sw.os', 'sw.stack' ]))
})

ava.test('should not return reset types', (test) => {
  const cache = new MatcherCache()

  const matcher1 = Contract.createMatcher({
    type: 'sw.os',
    slug: 'debian'
  })

  const matcher2 = Contract.createMatcher({
    type: 'sw.stack',
    slug: 'nodejs'
  })

  cache.add(matcher1, true)
  cache.add(matcher2, false)

  cache.resetType('sw.stack')

  test.deepEqual(cache.getTypes(), new Set([ 'sw.os' ]))
})
