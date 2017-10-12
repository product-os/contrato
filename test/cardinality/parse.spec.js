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
const cardinality = require('../../lib/cardinality')

_.each([

  // Fixed points

  {
    input: [ 1, 1 ],
    expected: {
      from: 1,
      to: 1,
      finite: true
    }
  },
  {
    input: [ 2, 2 ],
    expected: {
      from: 2,
      to: 2,
      finite: true
    }
  },
  {
    input: [ 3, 3 ],
    expected: {
      from: 3,
      to: 3,
      finite: true
    }
  },

  // Finite ranges

  {
    input: [ 1, 2 ],
    expected: {
      from: 1,
      to: 2,
      finite: true
    }
  },
  {
    input: [ 2, 3 ],
    expected: {
      from: 2,
      to: 3,
      finite: true
    }
  },
  {
    input: [ 1, 3 ],
    expected: {
      from: 1,
      to: 3,
      finite: true
    }
  },

  // Infinite ranges

  {
    input: [ 0, Infinity ],
    expected: {
      from: 0,
      to: Infinity,
      finite: false
    }
  },
  {
    input: [ 1, Infinity ],
    expected: {
      from: 1,
      to: Infinity,
      finite: false
    }
  },
  {
    input: [ 2, Infinity ],
    expected: {
      from: 2,
      to: Infinity,
      finite: false
    }
  },

  // Syntax sugar (asterisk notation)

  {
    input: [ 0, '*' ],
    expected: {
      from: 0,
      to: Infinity,
      finite: false
    }
  },
  {
    input: [ 1, '*' ],
    expected: {
      from: 1,
      to: Infinity,
      finite: false
    }
  },
  {
    // Surrounding whitespace
    input: [ 1, '   *   ' ],
    expected: {
      from: 1,
      to: Infinity,
      finite: false
    }
  },
  {
    input: [ 3, '*' ],
    expected: {
      from: 3,
      to: Infinity,
      finite: false
    }
  },

  // Syntax sugar (number)

  {
    input: 1,
    expected: {
      from: 1,
      to: 1,
      finite: true
    }
  },
  {
    input: 2,
    expected: {
      from: 2,
      to: 2,
      finite: true
    }
  },
  {
    input: 3,
    expected: {
      from: 3,
      to: 3,
      finite: true
    }
  },
  {
    input: '1',
    expected: {
      from: 1,
      to: 1,
      finite: true
    }
  },
  {
    input: '2',
    expected: {
      from: 2,
      to: 2,
      finite: true
    }
  },
  {
    input: '3',
    expected: {
      from: 3,
      to: 3,
      finite: true
    }
  },
  {
    input: '546',
    expected: {
      from: 546,
      to: 546,
      finite: true
    }
  },
  {
    input: '    3    ',
    expected: {
      from: 3,
      to: 3,
      finite: true
    }
  },

  // Syntax sugar (plus sign)

  {
    input: '1+',
    expected: {
      from: 1,
      to: Infinity,
      finite: false
    }
  },
  {
    input: '2+',
    expected: {
      from: 2,
      to: Infinity,
      finite: false
    }
  },
  {
    input: '3+',
    expected: {
      from: 3,
      to: Infinity,
      finite: false
    }
  },
  {
    input: '546+',
    expected: {
      from: 546,
      to: Infinity,
      finite: false
    }
  },
  {
    input: '    3+     ',
    expected: {
      from: 3,
      to: Infinity,
      finite: false
    }
  },
  {
    input: '3   +',
    expected: {
      from: 3,
      to: Infinity,
      finite: false
    }
  },

  // Syntax sugar (standalone asterisk)

  {
    input: '*',
    expected: {
      from: 0,
      to: Infinity,
      finite: false
    }
  },
  {
    input: '   *  ',
    expected: {
      from: 0,
      to: Infinity,
      finite: false
    }
  },

  // Syntax sugar (question sign)

  {
    input: '?',
    expected: {
      from: 0,
      to: 1,
      finite: true
    }
  },
  {
    input: '  ?  ',
    expected: {
      from: 0,
      to: 1,
      finite: true
    }
  },
  {
    input: '1?',
    expected: {
      from: 0,
      to: 1,
      finite: true
    }
  },
  {
    input: '1  ?',
    expected: {
      from: 0,
      to: 1,
      finite: true
    }
  }

], (testCase) => {
  ava.test(`should parse ${JSON.stringify(testCase.input)}`, (test) => {
    test.deepEqual(cardinality.parse(testCase.input), testCase.expected)
  })
})

_.each([
  {
    input: [ 1, 2, 3 ],
    error: 'Invalid cardinality: 1,2,3'
  },
  {
    input: [ 1 ],
    error: 'Invalid cardinality: 1'
  },
  {
    input: [ 2, 1 ],
    error: 'Invalid cardinality: 2,1'
  },
  {
    input: [ 0, 0 ],
    error: 'Invalid cardinality: 0,0'
  },
  {
    input: [ 0, -1 ],
    error: 'Invalid cardinality: 0,-1'
  },
  {
    input: [ -1, 0 ],
    error: 'Invalid cardinality: -1,0'
  },
  {
    input: [ -5, -5 ],
    error: 'Invalid cardinality: -5,-5'
  },
  {
    input: [ '*', 1 ],
    error: 'Invalid cardinality: *,1'
  },
  {
    input: [ '1', '2' ],
    error: 'Invalid cardinality: 1,2'
  },
  {
    input: [ '1', null ],
    error: 'Invalid cardinality: 1,'
  },
  {
    input: [ null, '1' ],
    error: 'Invalid cardinality: ,1'
  },
  {
    input: [ 1.5, 1.5 ],
    error: 'Invalid cardinality: 1.5,1.5'
  }
], (testCase) => {
  ava.test(`should throw "${testCase.error}" given ${JSON.stringify(testCase.input)}`, (test) => {
    test.throws(() => {
      cardinality.parse(testCase.input)
    }, testCase.error)
  })
})
