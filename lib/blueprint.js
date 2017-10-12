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

const _ = require('lodash')
const Contract = require('./contract')
const utils = require('./utils')
const cardinality = require('./cardinality')
const TYPES = require('./types')

class Blueprint extends Contract {
  /**
   * @summary Create a blueprint contract
   * @name Blueprint
   * @memberof module:contrato
   * @class
   * @public
   *
   * @param {Object} layout - the blueprint layout
   * @param {Object} skeleton - the blueprint skeleton
   *
   * @example
   * const blueprint = new Blueprint({
   *   'arch.sw': 1,
   *   'hw.device-type': 1
   * }, {
   *   type: 'my-context',
   *   slug: '{{children.arch.sw.slug}}-{{children.hw.device-type.slug}}'
   * })
   */
  constructor (layout, skeleton) {
    super({
      type: TYPES.BLUEPRINT,
      skeleton,
      layout
    })

    this.metadata.layout = _.reduce(this.raw.layout, (accumulator, value, type) => {
      const selector = {
        cardinality: cardinality.parse(value.cardinality || value),
        filter: value.filter
      }

      selector.cardinality.type = type

      const group = selector.cardinality.finite ? 'finite' : 'infinite'
      accumulator[group].selectors[type] = selector
      accumulator[group].types.add(type)
      accumulator.types.add(type)

      return accumulator
    }, {
      types: new Set(),
      finite: {
        selectors: {},
        types: new Set()
      },
      infinite: {
        selectors: {},
        types: new Set()
      }
    })
  }

  /**
   * @summary Reproduce the blueprint in a universe
   * @function
   * @name module:contrato.Blueprint#reproduce
   * @public
   *
   * @description
   * This method will generate a set of contexts that consist of
   * every possible valid combination that matches the blueprint
   * layout.
   *
   * @param {Object} contract - contract
   * @returns {Object[]} valid contexts
   *
   * @example
   * const contract = new Contract({ ... })
   * contract.addChildren([ ... ])
   *
   * const blueprint = new Blueprint({
   *   'hw.device-type': 1,
   *   'arch.sw': 1
   * })
   *
   * const contexts = blueprint.reproduce(contract)
   *
   * contexts.forEach((context) => {
   *   console.log(context.toJSON())
   * })
   */
  reproduce (contract) {
    const layout = this.metadata.layout

    const combinations = _.reduce(layout.finite.selectors, (accumulator, value) => {
      return accumulator.concat([
        contract.getChildrenCombinations(value.cardinality)
      ])
    }, [])

    const product = utils.cartesianProductWith(combinations, (accumulator, element) => {
      if (accumulator instanceof Contract) {
        const context = new Contract(this.raw.skeleton, {
          hash: false
        })

        context.addChildren(element.concat(accumulator.getChildren()), {
          rehash: false
        })

        // TODO: Make sure this is cached
        if (!context.areChildrenSatisfied({
          types: context.getChildrenTypes()
        })) {
          // `utils.cartesianProductWith()` expected undefined
          // eslint-disable-next-line no-undefined
          return undefined
        }

        return context
      }

      const context = new Contract(this.raw.skeleton, {
        hash: false
      })

      return context.addChildren(accumulator.concat(element), {
        rehash: false
      })
    })

    return product.filter((context) => {
      const references = context.getChildrenCrossReferencedContracts({
        from: contract,
        types: layout.infinite.types
      })

      const contracts = references.length === 0 ? contract.getChildren({
        types: layout.infinite.types
      }) : references

      context.addChildren(contracts, {
        rehash: false
      })

      for (const reference of contracts) {
        if (!context.satisfiesChildContract(reference, {
          types: layout.types
        })) {
          context.removeChild(reference, {
            rehash: false
          })
        }
      }

      if (!context.areChildrenSatisfied({
        types: layout.infinite.types
      })) {
        return false
      }

      context.interpolate()
      return true
    })
  }
}

module.exports = Blueprint
