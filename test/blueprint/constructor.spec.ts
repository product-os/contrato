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

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Contract'.
const Contract = require('../../lib/contract')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Blueprint'... Remove this comment to see the full error message
const Blueprint = require('../../lib/blueprint')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'cardinalit... Remove this comment to see the full error message
const cardinality = require('../../lib/cardinality')

ava('should be a contract', (test) => {
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
  const blueprint = new Blueprint({
    'hw.device-type': 1
  })

  test.true(blueprint instanceof Contract)
})

ava('should set a proper type', (test) => {
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
  const blueprint = new Blueprint({
    'hw.device-type': 1
  })

  test.is(blueprint.raw.type, 'meta.blueprint')
})

ava('should be a hashed contract', (test) => {
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
  const blueprint = new Blueprint({
    'hw.device-type': 1
  })

  test.is(typeof blueprint.metadata.hash, 'string')
})

ava('should parse a layout with one number selector', (test) => {
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
  const blueprint = new Blueprint({
    'hw.device-type': 1
  })

  test.deepEqual(blueprint.metadata.layout, {
    types: new Set([ 'hw.device-type' ]),
    finite: {
      selectors: {
        'hw.device-type': [ {
          cardinality: _.merge(cardinality.parse([ 1, 1 ]), {
            type: 'hw.device-type'
          }),
          filter: undefined,
          version: undefined,
          type: 'hw.device-type'
        } ]
      },
      types: new Set([ 'hw.device-type' ])
    },
    infinite: {
      selectors: {},
      types: new Set()
    }
  })
})

ava('should parse a layout with one finite and one infinite selectors', (test) => {
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
  const blueprint = new Blueprint({
    'hw.device-type': 2,
    'arch.sw': '1+'
  })

  test.deepEqual(blueprint.metadata.layout, {
    types: new Set([ 'hw.device-type', 'arch.sw' ]),
    finite: {
      selectors: {
        'hw.device-type': [ {
          cardinality: _.merge(cardinality.parse([ 2, 2 ]), {
            type: 'hw.device-type'
          }),
          filter: undefined,
          version: undefined,
          type: 'hw.device-type'
        } ]
      },
      types: new Set([ 'hw.device-type' ])
    },
    infinite: {
      selectors: {
        'arch.sw': [ {
          cardinality: _.merge(cardinality.parse([ 1, Infinity ]), {
            type: 'arch.sw'
          }),
          filter: undefined,
          version: undefined,
          type: 'arch.sw'
        } ]
      },
      types: new Set([ 'arch.sw' ])
    }
  })
})

ava('should support object layout selectors', (test) => {
  const filterFunction = _.identity

  // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
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
        'hw.device-type': [ {
          cardinality: _.merge(cardinality.parse([ 2, 2 ]), {
            type: 'hw.device-type'
          }),
          filter: undefined,
          version: undefined,
          type: 'hw.device-type'
        } ]
      },
      types: new Set([ 'hw.device-type' ])
    },
    infinite: {
      selectors: {
        'arch.sw': [ {
          cardinality: _.merge(cardinality.parse([ 1, Infinity ]), {
            type: 'arch.sw'
          }),
          filter: filterFunction,
          version: undefined,
          type: 'arch.sw'
        } ]
      },
      types: new Set([ 'arch.sw' ])
    }
  })
})

ava('should allow passing a skeleton object', (test) => {
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
