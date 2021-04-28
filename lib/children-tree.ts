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
 * @module children-tree
 */

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash')

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'utils'.
const utils = require('./utils')

/**
 * @summary Build a plain children tree out of a built contract
 * @function
 * @public
 * @memberof module:children-tree
 *
 * @param {Object} contract - contract
 * @returns {Object} children tree
 *
 * @example
 * const contract = new Contract({ ... })
 * contract.addChildren([ ... ])
 *
 * const tree = childrenTree.build(contract)
 */
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.build = (contract) => {
  const tree = {}

  for (const type of contract.metadata.children.types) {
    if (contract.metadata.children.byType[type].size === 1) {
      const hash = utils.setFirst(contract.metadata.children.byType[type])
      _.set(tree, type, contract.getChildByHash(hash).toJSON())
      continue
    }

    for (const slug of Object.keys(contract.metadata.children.byTypeSlug[type])) {
      const sources = []
      for (const hash of contract.metadata.children.byTypeSlug[type][slug]) {
        // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'any' is not assignable to parame... Remove this comment to see the full error message
        sources.push(contract.getChildByHash(hash).toJSON())
      }

      if (sources.length === 0) {
        continue
      }

      _.set(tree, `${type}.${slug}`, sources.length === 1 ? sources[0] : sources)
    }
  }

  return tree
}

/**
 * @summary Get all source contract children from a children tree
 * @function
 * @public
 * @memberof module:children-tree
 *
 * @param {Object} tree - children tree
 * @returns {Object[]} children source contracts
 *
 * @example
 * const tree = {
 *   hw: {
 *     'device-type': { ... }
 *   },
 *   sw: {
 *     distro: {
 *       debian: { ... },
 *       fedora: { ... }
 *     }
 *   }
 * }
 *
 * childrenTree.getAll(tree).forEach((sourceContract) => {
 *   console.log(sourceContract.slug, sourceContract.version)
 * })
 */
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.getAll = (tree) => {
  // @ts-expect-error ts-migrate(6133) FIXME: 'key' is declared but its value is never read.
  return _.reduce(tree, (accumulator, value, key) => {
    if (!value.slug) {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
      return accumulator.concat(exports.getAll(value))
    }

    accumulator.push(value)
    return accumulator
  }, [])
}
