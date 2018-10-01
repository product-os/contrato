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
const semver = require('semver')
const Contract = require('./contract')
const utils = require('./utils')
const cardinality = require('./cardinality')
const TYPES = require('./types')

/**
 * @ignore
 */
class Blueprint extends Contract {
  /**
   * @summary A blueprint contract data structure
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
  constructor(layout, skeleton) {
    super({
      type: TYPES.BLUEPRINT,
      skeleton,
      layout
    })

    this.metadata.layout = _.reduce(this.raw.layout, (accumulator, value, type) => {
      const selector = {
        cardinality: cardinality.parse(value.cardinality || value),
        filter: value.filter,
        type: value.type || type,
        version: value.version
      }

      selector.cardinality.type = selector.type

      const group = selector.cardinality.finite ? 'finite' : 'infinite'
      accumulator[group].selectors[selector.type] = _.concat(accumulator[group].selectors[selector.type] || [], [selector]);
      accumulator[group].types.add(selector.type)
      accumulator.types.add(selector.type)

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
  sequence(contract) {
    const layout = this.metadata.layout

    console.error(`Got layout: ${JSON.stringify(layout.finite.selectors)}`)
    const combinations = _.reduce(layout.finite.selectors, (accumulator, value) => {
      console.error(`Running through selector type: ${JSON.stringify(value)}`)
      let internalAccumulator = accumulator
      _.forEach(value, (option) => {
        console.error(`Running selector: ${JSON.stringify(option)}`)
        const combi = _.uniqWith(contract.getChildrenCombinations(option), (left, right) => {
          return Contract.isEqual(left[0], right[0])
        })
        console.error(`Resulted in: ${JSON.stringify(combi)}`)
        internalAccumulator = internalAccumulator.concat([
          combi
        ])
      })
      return internalAccumulator
    }, [])

    console.error(`Created combinations: ${JSON.stringify(combinations)}`)

    _.forEach(combinations, (dimension) => {
      dimension.sort((left, right) => {
        return semver.compare(left[0].raw.version, right[0].raw.version)
      })
    })

    const currentPointer = new Array(combinations.length)
    _.fill(currentPointer, 0)

    const bestPointer = new Array(combinations.length)
    for (let idx = 0; idx < combinations.length; idx++) {
      bestPointer[idx] = combinations[idx].length - 1
    }

    const buildContextFromPointer = (pointer) => {
      const context = new Contract(this.raw.skeleton, {
        hash: false
      })
      const combination = []
      for (let idx = 0; idx < combinations.length; idx++) {
        combination.push(combinations[idx][pointer[idx]])
      }
      context.addChildren(_.flatten(combination), {
        rehash: true
      })

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
      return context;
    }
    /**
     * This will validate if a certain set of possibilities is good
     */
    const checkSolutions = (pointer) => {
      const context = buildContextFromPointer(pointer)
      return context.areChildrenSatisfied()
    }

    const checked = []

    const pointerValue = (pointer) => {
      return _.reduce(pointer, (sum, value) => {
        return sum + value
      }, 0);
    }

    let currentBestPointer = new Array(combinations.length)
    _.fill(currentBestPointer, 0)
    let currentBestPointerValue = pointerValue(currentBestPointer)
    let currentBestPath = []

    const isValidPointer = (pointer) => {
      if (_.includes(checked, pointer)) {
        return false
      }
      for (let idx = 0; idx < combinations.length; idx++) {
        if (pointer[idx] > bestPointer[idx]) {
          return false
        }
      }
      if (!checkSolutions(pointer)) {
        return false
      }
      return true
    }
    /**
     * Implements a simple recursive depth first search on the graph
     * @param {*} combinations asd asd
     * @param {*} pointer asdas
     */
    const search = (combinations, pointer, path) => {
      checked.push(pointer)
      for (let idx = 0; idx < combinations.length; idx++) {
        const possiblePointer = _.clone(pointer)
        possiblePointer[idx] += 1
        if (isValidPointer(possiblePointer)) {
          const currentPath = _.clone(path)
          currentPath.push(possiblePointer)
          if (_.isEqual(possiblePointer, bestPointer)) {
            currentBestPath = currentPath
            return true
          }
          const solutionValue = pointerValue(possiblePointer)
          if (solutionValue > currentBestPointerValue) {
            currentBestPointer = possiblePointer
            currentBestPath = currentPath
          }
          if (search(combinations, possiblePointer, currentPath)) {
            return true
          }
          return false
        }
      }
      return []
    }

    search(combinations, currentPointer, [ currentPointer ])

    console.log(`Got Path: ${JSON.stringify(currentBestPath)}`)
    console.log(`Best pointer: ${JSON.stringify(bestPointer)}`)

    return _.reduce(currentBestPath, (seq, pointer) => {
      console.log(`Building contract for pointer: ${JSON.stringify(pointer)}`)
      const context = buildContextFromPointer(pointer)
      if (!context.areChildrenSatisfied({
          types: layout.infinite.types
        })) {
        return seq
      }

      context.interpolate()
      seq.push(context)
      return seq
    }, [])
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
  reproduce(contract) {
    const layout = this.metadata.layout

    console.error(`Got layout: ${JSON.stringify(layout.finite.selectors)}`)
    const combinations = _.reduce(layout.finite.selectors, (accumulator, value) => {
      console.error(`Running through selector type: ${JSON.stringify(value)}`)
      let internalAccumulator = accumulator
      _.forEach(value, (option) => {
        console.error(`Running selector: ${JSON.stringify(option)}`)
        internalAccumulator = internalAccumulator.concat([
          contract.getChildrenCombinations(option)
        ])
      })
      return internalAccumulator
    }, [])


    console.error(`Created combinations: ${JSON.stringify(combinations)}`)

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
