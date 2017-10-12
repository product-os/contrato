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
const _ = require('lodash')
const Contract = require('../../lib/contract')
const Blueprint = require('../../lib/blueprint')
const cardinality = require('../../lib/cardinality')

ava.test('should be a contract', (test) => {
  const blueprint = new Blueprint({
    'hw.device-type': 1
  })

  test.true(blueprint instanceof Contract)
})

ava.test('should set a proper type', (test) => {
  const blueprint = new Blueprint({
    'hw.device-type': 1
  })

  test.is(blueprint.raw.type, 'meta.blueprint')
})

ava.test('should be a hashed contract', (test) => {
  const blueprint = new Blueprint({
    'hw.device-type': 1
  })

  test.is(typeof blueprint.metadata.hash, 'string')
})

ava.test('should parse a layout with one number selector', (test) => {
  const blueprint = new Blueprint({
    'hw.device-type': 1
  })

  test.deepEqual(blueprint.metadata.layout, {
    types: new Set([ 'hw.device-type' ]),
    finite: {
      selectors: {
        'hw.device-type': {
          cardinality: _.merge(cardinality.parse([ 1, 1 ]), {
            type: 'hw.device-type'
          }),
          filter: undefined
        }
      },
      types: new Set([ 'hw.device-type' ])
    },
    infinite: {
      selectors: {},
      types: new Set()
    }
  })
})

ava.test('should parse a layout with one finite and one infinite selectors', (test) => {
  const blueprint = new Blueprint({
    'hw.device-type': 2,
    'arch.sw': '1+'
  })

  test.deepEqual(blueprint.metadata.layout, {
    types: new Set([ 'hw.device-type', 'arch.sw' ]),
    finite: {
      selectors: {
        'hw.device-type': {
          cardinality: _.merge(cardinality.parse([ 2, 2 ]), {
            type: 'hw.device-type'
          }),
          filter: undefined
        }
      },
      types: new Set([ 'hw.device-type' ])
    },
    infinite: {
      selectors: {
        'arch.sw': {
          cardinality: _.merge(cardinality.parse([ 1, Infinity ]), {
            type: 'arch.sw'
          }),
          filter: undefined
        }
      },
      types: new Set([ 'arch.sw' ])
    }
  })
})

ava.test('should support object layout selectors', (test) => {
  const filterFunction = _.identity

  const blueprint = new Blueprint({
    'hw.device-type': {
      cardinality: [ 2, 2 ]
    },
    'arch.sw': {
      cardinality: '1+',
      filter: filterFunction
    }
  })

  test.deepEqual(blueprint.metadata.layout, {
    types: new Set([ 'hw.device-type', 'arch.sw' ]),
    finite: {
      selectors: {
        'hw.device-type': {
          cardinality: _.merge(cardinality.parse([ 2, 2 ]), {
            type: 'hw.device-type'
          }),
          filter: undefined
        }
      },
      types: new Set([ 'hw.device-type' ])
    },
    infinite: {
      selectors: {
        'arch.sw': {
          cardinality: _.merge(cardinality.parse([ 1, Infinity ]), {
            type: 'arch.sw'
          }),
          filter: filterFunction
        }
      },
      types: new Set([ 'arch.sw' ])
    }
  })
})

ava.test('should allow passing a skeleton object', (test) => {
  const blueprint = new Blueprint({
    'hw.device-type': 1
  }, {
    type: 'sw.os-image',
    name: 'Generic OS Image'
  })

  test.deepEqual(blueprint.raw.skeleton, {
    type: 'sw.os-image',
    name: 'Generic OS Image'
  })
})
