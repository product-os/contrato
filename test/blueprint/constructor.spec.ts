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
import * as _ from 'lodash';

import Contract from '../../lib/contract';

import Blueprint from '../../lib/blueprint';
import { parse } from '../../lib/cardinality';

test('should be a contract', (test) => {
	const blueprint = new Blueprint({
		'hw.device-type': 1
	})

	test.true(blueprint instanceof Contract)
})

test('should set a proper type', (test) => {
	const blueprint = new Blueprint({
		'hw.device-type': 1
	})

	test.is(blueprint.raw.type, 'meta.blueprint')
})

test('should be a hashed contract', (test) => {
	const blueprint = new Blueprint({
		'hw.device-type': 1
	})

	test.is(typeof blueprint.metadata.hash, 'string')
})

test('should parse a layout with one number selector', (test) => {
	const blueprint = new Blueprint({
		'hw.device-type': 1
	})

	test.deepEqual(blueprint.metadata.layout, {
		types: new Set([ 'hw.device-type' ]),
		finite: {
			selectors: {
				'hw.device-type': [ {
					cardinality: _.merge(parse([ 1, 1 ]), {
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

test('should parse a layout with one finite and one infinite selectors', (test) => {
	const blueprint = new Blueprint({
		'hw.device-type': 2,
		'arch.sw': '1+'
	})

	test.deepEqual(blueprint.metadata.layout, {
		types: new Set([ 'hw.device-type', 'arch.sw' ]),
		finite: {
			selectors: {
				'hw.device-type': [ {
					cardinality: _.merge(parse([ 2, 2 ]), {
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
					cardinality: _.merge(parse([ 1, Infinity ]), {
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

test('should support object layout selectors', (test) => {
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
				'hw.device-type': [ {
					cardinality: _.merge(parse([ 2, 2 ]), {
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
					cardinality: _.merge(parse([ 1, Infinity ]), {
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

test('should allow passing a skeleton object', (test) => {
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
