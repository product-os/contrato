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

import test from 'ava';

import MatcherCache from '../../lib/matcher-cache';
import Contract from '../../lib/contract';

test('should add one value to the cache', (test) => {
  const cache = new MatcherCache()

  const matcher1 = Contract.createMatcher({
    type: 'sw.os',
    slug: 'debian'
  })

  cache.add(matcher1, true)

  test.deepEqual(cache.data, {
    'sw.os': {
      [matcher1.metadata.hash]: {
        value: true,
        matcher: matcher1
      }
    }
  })
})

test('should add two values to the cache using the same type', (test) => {
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
    }
  })
})

test('should add two values to the cache using different types', (test) => {
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

  test.deepEqual(cache.data, {
    'sw.os': {
      [matcher1.metadata.hash]: {
        value: true,
        matcher: matcher1
      }
    },
    'sw.stack': {
      [matcher2.metadata.hash]: {
        value: false,
        matcher: matcher2
      }
    }
  })
})
