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
const skhema = require('skhema')

/**
 * @ignore
 */
class Composite extends Contract {
  /**
   * @summary A Composite contract data structure
   * @name Composite
   * @memberof module:contrato
   * @class
   * @public
   *
   * @param {Object} layout - the Composite layout
   * @param {Object} skeleton - the Composite skeleton
   *
   * @example
   * const composite = new Composite({
   *   'arch.sw': 1,
   *   'hw.device-type': 1
   * }, {
   *   type: 'my-context',
   *   slug: '{{children.arch.sw.slug}}-{{children.hw.device-type.slug}}'
   * })
   */
  constructor (layout, skeleton) {
    super({
      type: TYPES.COMPOSITE,
      layout,
      skeleton,
    })

    this.metadata.layout = _.reduce(this.raw.layout, (accumulator, value, alias) => {
      const type = value.type || alias

      const selector = {
        cardinality: cardinality.parse(value.cardinality || value),
        filter: value.filter,
        alias: alias,
        type: type
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

    this.metadata.mappings = skeleton.mappings
  }

  static transform (template) {
    const buildLayoutFilters = (child) => {
      let filters = _.omit(child, 'version', 'cardinality', 'type')
      child = _.pick(child, 'version', 'cardinality', 'type')
      if (!_.isEmpty(filters)) {
        child.filter = Blueprint.buildFilter(filters)
      }
      return child
    }

    let layout = {}
    if (template.consists_of) {
      template.consists_of = _.mapValues(template.consists_of, (child, label) => {
        layout[label] = buildLayoutFilters(child)
        return `{{>this.children.${label}}}`
      })
    }

    if (template.data) {
      template.data = _.transform(template.data, (data, child, label) => {
        if (label.startsWith('$')) {
          label = label.slice(1)
          layout[label] = buildLayoutFilters(child)
          data[label] = `{{>this.children.${label}}}`
        }
        return child
      })
    }

    return {
      layout: layout,
      skeleton: template
    }
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
   * const contexts = blueprint.apply(contract)
   *
   * contexts.forEach((context) => {
   *   console.log(context.toJSON())
   * })
   */
  apply (contract) {
    const layout = this.metadata.layout

    const combinations = _.reduce(layout.finite.selectors, (accumulator, value) => {
      const results = contract.getChildrenCombinations(value)
      const aliasedChildren = _.map(results, (children) => {
        return _.map(children, (child) => {
          return child.extend({ reference: value.alias })
        })
      })
      return accumulator.concat([aliasedChildren])
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

    return _(product)
    .map((context) => {
      context.interpolate()

      let childrenWithCapabilities = _.pickBy(context.raw.consists_of, (child) => child.capabilities)
      let childrenRequirements = _.mapValues(_.pickBy(context.raw.consists_of, (child) => child.requires), (c) => _.get(c, 'requires'))
      if (context.raw.mappings) {
        for (const mapping of context.raw.mappings) {
          const contextCapability = mapping.capability
          const contextRequirement = mapping.requirement

          const childWithCapability = childrenWithCapabilities[contextCapability.from]
          const childRequirements = childrenRequirements[contextRequirement.from]

          const requirement = _.find(childRequirements, (requirement) => requirement.type === contextRequirement.type)

          const satisfies = this.checkChildrenMappings(
            context,
            Composite.requirementToCapabilityFilter(requirement, contextCapability.label),
            childWithCapability.type
          )

          if (satisfies) {
            childrenWithCapabilities = _.omit(childrenWithCapabilities, contextCapability.from)
            childrenRequirements[contextRequirement.from] = _.filter(childRequirements, (r) => r !== requirement)
          } else {
            return false
          }
        }
      }

      return this.extendWithChildResidues(context, childrenRequirements, childrenWithCapabilities)
    })
    .compact()
    .value()
  }

  extendWithChildResidues (context, requirements, childrenWithCapabilities) {
    requirements = _.reduce(requirements, (acc, v, k) => {
      let req = {}
      req[k] = v
      acc.push(req)
      return acc
    }, [])

    if (!_.isEmpty(requirements)) {
      if (_.isArray(context.raw.requires)) {
        context.raw.requires.concat(requirements)
      } else {
        context.raw.requires = requirements
      }
    }
    
    const capabilities = _.mapValues(childrenWithCapabilities, (child) => _.pick(child, 'capabilities')) 

    if (!_.isEmpty(capabilities)) {
      context.raw.capabilities = _.merge({}, context.raw.capabilities, capabilities)
    }
    return context
  }

  checkChildrenMappings (context, requirement, type) {
    let contracts = context.getChildrenByType(type)

    const filterValidator = _.partial(skhema.isValid, requirement)
    contracts = _.filter(contracts, (con) => {
      return filterValidator(con.raw)
    })

    return !_.isEmpty(contracts)
  }

  static buildFilter (filter) {
    return {
      type: "object",
      properties: _.mapValues(filter, (property) => {
        return {
          "type": "string",
          "enum": [
            property
          ]
        }
      }),
      required: _.keys(filter)
    }
  }

  static requirementToCapabilityFilter (requirement, label) {
    const capablityFilter = {}
    capablityFilter[label] = Composite.buildFilter(requirement)
    return {
      type: "object",
      properties: {
        capabilities: {
          type: "object",
          properties: capablityFilter,
          required: [label]
        }
      },
      required: ["capabilities"]
    }
  }
  // satisfiesMappings ()
  // satisfiesChildContract (contract, options = {}) {
  //   const conjuncts = _.reduce(contract.getChildren(), (accumulator, child) => {
  //     return accumulator.concat(child.metadata.requirements.compiled.getAll())
  //   }, contract.metadata.requirements.compiled.getAll())

  //   // (1) If the top level list of conjuncts is empty,
  //   // then we can assume the requirements are fulfilled
  //   // and stop without doing any further computations.
  //   if (conjuncts.length === 0) {
  //     return true
  //   }

  //   // Check if contract.mappings are satisfied by conjuncts
  //   if (contract.mappings) {
  //     if (!this.satisfiesMappings(contract.mappings, conjuncts)) {
  //       return false
  //     }
  //   }
  //   options.conjuncts = conjuncts
  //   return super.satisfiesChildContract(contracte, options)
  // }

}

module.exports = Composite
