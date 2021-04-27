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

ava('should return the value if the matcher was cached', (test) => {
  const cache = new MatcherCache()

  const matcher1 = Contract.createMatcher({
    type: 'sw.os',
    slug: 'debian'
  })

  cache.add(matcher1, {
    matcher: 'debian'
  })

  test.deepEqual(cache.get(matcher1), {
    matcher: 'debian'
  })
})

ava('should return null if the matcher was not cached', (test) => {
  const cache = new MatcherCache()

  const matcher1 = Contract.createMatcher({
    type: 'sw.os',
    slug: 'debian'
  })

  const matcher2 = Contract.createMatcher({
    type: 'sw.os',
    slug: 'fedora'
  })

  cache.add(matcher1, {
    matcher: 'debian'
  })

  test.deepEqual(cache.get(matcher2), null)
})
