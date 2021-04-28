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

/**
 * @module cardinality
 */

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash')

/**
 * @summary The length of a cardinality ordered pair (a tuple)
 * @type {Number}
 * @constant
 */
const ORDERED_LIST_LENGTH = 2

/**
 * @summary Parse a contracts cardinality tuple/string/number
 * @function
 * @public
 * @memberof module:cardinality
 *
 * @description
 * A cardinality is usually represented with a tuple that defines
 * a range of integers. On top of that, this function supports the
 * following syntax sugar, assuming `x` in an integer:
 *
 * - `x` -> `[ x, x ]`
 * - `*` -> `[ 0, Infinity ]`
 * - `?` -> `[ 0, 1 ]`
 * - `1?` -> `[ 0, 1 ]`
 * - `'x'` -> `[ x, x ]`
 * - `x+` -> `[ x, Infinity ]`
 * - `[ x, '*' ]` -> `[ x, Infinity ]`
 *
 * @param {(Array|String|Number)} input - cardinality
 * @returns {Object} parsed cardinality
 *
 * @example
 * const result = cardinality.parse([ 1, 2 ])
 * console.log(result.from)
 * console.log(result.to)
 *
 * if (result.finite) {
 *   console.log('This is a finite cardinality')
 * }
 */
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.parse = (input) => {
  if (_.isNumber(input)) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
    return exports.parse([ input, input ])
  }

  if (_.isString(input)) {
    const normalizedInput = _.trim(input)

    if (normalizedInput === '*') {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
      return exports.parse([ 0, Infinity ])
    }

    if (normalizedInput === '?' || /^1\s*\?$/.test(normalizedInput)) {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
      return exports.parse([ 0, 1 ])
    }

    if (/^[0-9]+$/.test(normalizedInput)) {
      const number = _.parseInt(normalizedInput)

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
      return exports.parse([ number, number ])
    }

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
    return exports.parse([
      _.parseInt(_.join(_.initial(normalizedInput), '')),
      Infinity
    ])
  }

  const [ from, to ] = input

  // Alias an asterisk to Infinity
  if (_.trim(to) === '*') {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
    return exports.parse([ from, Infinity ])
  }

  if (_.some([
    _.isEqual(input, [ 0, 0 ]),
    from < 0,
    to < 0,
    _.size(input) !== ORDERED_LIST_LENGTH,
    from > to,
    !_.isInteger(from),
    !_.isInteger(to) && to !== Infinity
  ])) {
    throw new Error(`Invalid cardinality: ${input}`)
  }

  return {
    from,
    to,
    finite: to !== Infinity
  }
}
