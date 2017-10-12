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
 * Contract variants are syntax sugar that allows the client
 * to express multiple different contracts that share many
 * properties in common as a single object, to avoid repetition.
 */

/**
 * @module variants
 */

const _ = require('lodash')

/**
 * @summary The name of the contract property that contains variants
 * @type {String}
 * @constant
 */
const VARIANTS_PROPERTY = 'variants'

/**
 * @summary Build contract variants
 * @function
 * @public
 * @memberof module:variants
 *
 * @description
 * A contract might declare a set of variants of itself as a way
 * to express many different related contracts that share a large
 * set of properties in a single contract to avoid duplication.
 *
 * Before this type of contract can be used, you need to build
 * the variants, and get a list of the final contracts.
 *
 * @param {Object} contract - contract
 * @returns {Object[]} contracts
 *
 * @example
 * const contracts = variants.build({
 *   type: 'distro',
 *   name: 'Debian',
 *   slug: 'debian',
 *   variants: [
 *     {
 *       version: 'wheezy'
 *     },
 *     {
 *       version: 'jessie'
 *     }
 *   ]
 * })
 */
exports.build = (contract) => {
  const variants = contract[VARIANTS_PROPERTY] || []
  const base = _.omit(contract, [ VARIANTS_PROPERTY ])

  if (variants.length === 0) {
    return [ base ]
  }

  return _.reduce(variants, (accumulator, variation) => {
    return _.concat(accumulator, _.map(exports.build(variation), (template) => {
      return _.mergeWith({}, base, template, (object, source) => {
        if (_.isArray(object)) {
          return _.concat(object, source)
        }

        // _.mergeWith expects "undefined"
        // eslint-disable-next-line no-undefined
        return undefined
      })
    }))
  }, [])
}
