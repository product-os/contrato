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
const combinatorics = require('js-combinatorics')
const skhema = require('skhema')
const semver = require('semver')
const hash = require('./hash')
const TYPES = require('./types')
const ObjectSet = require('./object-set')
const MatcherCache = require('./matcher-cache')
const template = require('./template')
const variants = require('./variants')
const utils = require('./utils')
const childrenTree = require('./children-tree')

/**
 * @ignore
 */
class Contract {
  /**
   * @summary A contract data structure
   * @name Contract
   * @memberof module:contrato
   * @class
   * @public
   *
   * @param {Object} object - the contract plain object
   * @param {Object} [options] - options
   * @param {Boolean} [options.hash=true] - whether to hash the contract
   *
   * @example
   * const contract = new Contract({
   *   type: 'arch.sw',
   *   name: 'armv7hf',
   *   slug: 'armv7hf'
   * })
   */
  constructor (object, options = {}) {
    this.raw = object
    this.metadata = {
      children: {
        searchCache: new MatcherCache(),
        types: new Set(),
        map: {},
        byType: {},
        byTypeSlug: {},
        typeMatchers: {}
      }
    }

    for (const source of childrenTree.getAll(this.raw.children)) {
      this.addChild(new Contract(source))
    }

    this.interpolate({
      rehash: false
    })

    _.defaults(options, {
      hash: true
    })

    if (options.hash) {
      this.hash()
    }
  }

  /**
   * @summary Re-hash the contract
   * @function
   * @name module:contrato.Contract#hash
   * @protected
   *
   * @example
   * const contract = new Contract({ ... })
   * contract.hash()
   */
  hash () {
    this.metadata.hash = hash.hashObject(this.raw)
  }

  /**
   * @summary Re-build the contract's internal data structures
   * @function
   * @name module:contrato.Contract#rebuild
   * @protected
   *
   * @example
   * const contract = new Contract({ ... })
   * contract.rebuild()
   */
  rebuild () {
    const tree = childrenTree.build(this)
    if (Object.keys(tree).length > 0) {
      this.raw.children = tree
    }

    this.metadata.requirements = {
      matchers: {},
      types: new Set(),
      compiled: new ObjectSet()
    }

    /**
     * @summary Create and register a requirements matcher
     * @function
     * @private
     *
     * @param {Object} data - matcher data
     * @returns {Object} matcher object
     *
     * @example
     * const matcher = registerMatcher({
     *   type: 'arch.sw',
     *   slug: 'armv7hf'
     * })
     */
    const registerMatcher = (data) => {
      const matcher = Contract.createMatcher(data)

      if (!this.metadata.requirements.matchers[data.type]) {
        this.metadata.requirements.matchers[data.type] = new ObjectSet()
      }

      this.metadata.requirements.matchers[data.type].add(matcher, {
        id: matcher.metadata.hash
      })

      this.metadata.requirements.types.add(data.type)
      return matcher
    }

    for (const conjunct of this.raw.requires || []) {
      if (conjunct.type) {
        const matcher = registerMatcher(conjunct)
        this.metadata.requirements.compiled.add(matcher, {
          id: matcher.metadata.hash
        })

        continue
      }

      const operand = _.first(_.keys(conjunct))
      const matchers = new ObjectSet()

      for (const disjunct of conjunct[operand]) {
        const matcher = registerMatcher(disjunct)
        matchers.add(matcher, {
          id: matcher.metadata.hash
        })
      }

      const operationContract = Contract.createMatcher(matchers, {
        operation: 'or'
      })

      this.metadata.requirements.compiled.add(operationContract, {
        id: operationContract.metadata.hash
      })
    }
  }

  /**
   * @summary Interpolate the contract's template
   * @function
   * @name module:contrato.Contract#interpolate
   * @protected
   *
   * @param {Object} [options] - options
   * @param {Boolean} [options.rehash=true] - whether to re-hash the contract
   * @returns {Object} contract instance
   *
   * @example
   * const contract = new Contract({ ... })
   * contract.interpolate()
   */
  interpolate (options = {}) {
    // TODO: Find a way to keep track of whether the contract
    // has already been fully templated, and if so, avoid
    // running this function.
    this.raw = template.compileContract(this.raw, {
      // Each contract is only templated using its own
      // properties, so here we prevent interpolations
      // on children using the master contract as a root.
      blacklist: new Set([ 'children' ])
    })

    _.defaults(options, {
      rehash: true
    })

    this.rebuild()
    if (options.rehash) {
      this.hash()
    }

    return this
  }

  /**
   * @summary Get the contract version
   * @function
   * @name module:contrato.Contract#getVersion
   * @public
   *
   * @returns {String} slug - contract version
   *
   * @example
   * const contract = new Contract({
   *   type: 'sw.os',
   *   name: 'Debian Wheezy',
   *   version: 'wheezy',
   *   slug: 'debian'
   * })
   *
   * console.log(contract.getVersion())
   */
  getVersion () {
    return this.raw.version
  }

  /**
   * @summary Get the contract slug
   * @function
   * @name module:contrato.Contract#getSlug
   * @public
   *
   * @returns {String} slug - contract slug
   *
   * @example
   * const contract = new Contract({
   *   type: 'arch.sw',
   *   name: 'armv7hf',
   *   slug: 'armv7hf'
   * })
   *
   * console.log(contract.getSlug())
   */
  getSlug () {
    return this.raw.slug
  }

  /**
   * @summary Get all the slugs this contract can be referenced with
   * @function
   * @name module:contrato.Contract#getAllSlugs
   * @public
   *
   * @returns {Set} slugs
   *
   * @example
   * const contract = new Contract({
   *   type: 'hw.device-type',
   *   name: 'Raspberry Pi',
   *   slug: 'raspberrypi',
   *   aliases: [ 'rpi', 'raspberry-pi' ]
   * })
   *
   * console.log(contract.getAllSlugs())
   * > Set { raspberrypi, rpi, raspberry-pi }
   */
  getAllSlugs () {
    const slugs = new Set(this.raw.aliases)
    slugs.add(this.getSlug())
    return slugs
  }

  /**
   * @summary Check if a contract has aliases
   * @function
   * @name module:contrato.Contract#hasAliases
   * @public
   *
   * @returns {Boolean} whether the contract has aliases
   *
   * @example
   * const contract = new Contract({
   *   type: 'hw.device-type',
   *   name: 'Raspberry Pi',
   *   slug: 'raspberrypi',
   *   aliases: [ 'rpi', 'raspberry-pi' ]
   * })
   *
   * if (contract.hasAliases()) {
   *   console.log('This contract has aliases')
   * }
   */
  hasAliases () {
    return Boolean(this.raw.aliases) && this.raw.aliases.length > 0
  }

  /**
   * @summary Get the contract canonical slug
   * @function
   * @name module:contrato.Contract#getCanonicalSlug
   * @public
   *
   * @returns {String} slug - contract canonical slug or slug if canonical slug doesn't exist
   *
   * @example
   * const contract = new Contract({
   *   type: 'arch.sw',
   *   name: 'armv7hf',
   *   slug: 'armv7hf'
   *   canonicalSlug: 'raspberry-pi'
   * })
   *
   * console.log(contract.getCanonicalSlug())
   */
  getCanonicalSlug () {
    return this.raw.canonicalSlug || this.getSlug()
  }

  /**
   * @summary Get the contract type
   * @function
   * @name module:contrato.Contract#getType
   * @public
   *
   * @returns {String} type - contract type
   *
   * @example
   * const contract = new Contract({
   *   type: 'arch.sw',
   *   name: 'armv7hf',
   *   slug: 'armv7hf'
   * })
   *
   * console.log(contract.getType())
   */
  getType () {
    return this.raw.type
  }

  /**
   * @summary Get a reference string for the contract
   * @function
   * @name module:contrato.Contract#getReferenceString
   * @public
   *
   * @returns {String} reference string
   *
   * @example
   * const contract = new Contract({
   *   type: 'arch.sw',
   *   name: 'armv7hf',
   *   slug: 'armv7hf'
   * })
   *
   * console.log(contract.getReferenceString())
   */
  getReferenceString () {
    const slug = this.getSlug()
    const version = this.getVersion()
    return version ? `${slug}@${version}` : slug
  }

  /**
   * @summary Return a JSON representation of a contract
   * @function
   * @name module:contrato.Contract#toJSON
   * @public
   *
   * @returns {Object} JSON object
   *
   * @example
   * const contract = new Contract({ ... })
   * const object = contract.toJSON()
   * console.log(JSON.stringify(object))
   */
  toJSON () {
    // Ensure changes to the returned reference don't
    // accidentally mutate the contract's internal state
    return Object.assign({}, this.raw)
  }

  /**
   * @summary Add a child contract
   * @function
   * @name module:contrato.Contract#addChild
   * @public
   *
   * @param {Object} contract - contract
   * @param {Object} [options] - options
   * @param {Boolean} [options.rehash=true] - whether to re-hash the parent contract
   * @param {Boolean} [options.rebuild=true] - whether to re-build the parent contract
   * @returns {Object} contract
   *
   * @example
   * const contract = new Contract({ ... })
   * contract.addChild(new Contract({ ... }))
   */
  addChild (contract, options = {}) {
    const type = contract.getType()

    if (this.metadata.children.map[contract.metadata.hash]) {
      return this
    }

    if (!this.metadata.children.types.has(type)) {
      this.metadata.children.byType[type] = new Set()
      this.metadata.children.byTypeSlug[type] = {}
    }

    for (const slug of contract.getAllSlugs()) {
      if (!this.metadata.children.byTypeSlug[type][slug]) {
        this.metadata.children.byTypeSlug[type][slug] = new Set()
      }

      this.metadata.children.byTypeSlug[type][slug].add(contract.metadata.hash)
    }

    this.metadata.children.types.add(type)
    this.metadata.children.map[contract.metadata.hash] = contract
    this.metadata.children.byType[type].add(contract.metadata.hash)
    this.metadata.children.searchCache.resetType(type)

    _.defaults(options, {
      rehash: true,
      rebuild: true
    })

    if (options.rebuild) {
      this.rebuild()
    }

    if (options.rehash) {
      this.hash()
    }

    return this
  }

  /**
   * @summary Remove a child contract
   * @function
   * @name module:contrato.Contract#removeChild
   * @public
   *
   * @param {Object} contract - contract
   * @param {Object} [options] - options
   * @param {Boolean} [options.rehash=true] - whether to rehash the contract
   * @returns {Object} parent contract
   *
   * @example
   * const contract = new Contract({ ... })
   *
   * const child = new Contract({ ... })
   * contract.addChild(child)
   * contract.removeChild(child)
   */
  removeChild (contract, options = {}) {
    _.defaults(options, {
      rehash: true
    })

    const type = contract.getType()
    const childHash = contract.metadata.hash

    if (!this.raw.children || !this.metadata.children.map[childHash]) {
      return this
    }

    Reflect.deleteProperty(this.metadata.children.map, childHash)
    this.metadata.children.byType[type].delete(childHash)

    if (this.metadata.children.byType[type].size === 0) {
      Reflect.deleteProperty(this.metadata.children.byType, type)
      this.metadata.children.types.delete(type)
    }

    for (const slug of contract.getAllSlugs()) {
      this.metadata.children.byTypeSlug[type][slug].delete(childHash)
      if (this.metadata.children.byTypeSlug[type][slug].size === 0) {
        Reflect.deleteProperty(this.metadata.children.byTypeSlug[type], slug)
      }
    }

    if (Object.keys(this.metadata.children.byTypeSlug[type]).length === 0) {
      Reflect.deleteProperty(this.metadata.children.byTypeSlug, type)
    }

    this.metadata.children.searchCache.resetType(contract.getType())
    this.rebuild()

    if (options.rehash) {
      this.hash()
    }

    return this
  }

  /**
   * @summary Add a set of children contracts to the contract
   * @function
   * @name module:contrato.Contract#addChildren
   * @public
   *
   * @description
   * This is a utility method over `.addChild()`.
   *
   * @param {Object[]} contracts - contracts
   * @param {Object} [options] - options
   * @param {Boolean} [options.rehash=true] - whether to rehash the contract
   * @returns {Object} contract
   *
   * @example
   * const contract = new Contract({ ... })
   * contract.addChildren([
   *   new Contract({ ... }),
   *   new Contract({ ... }),
   *   new Contract({ ... })
   * ])
   */
  addChildren (contracts, options = {}) {
    if (!contracts) {
      return this
    }

    _.defaults(options, {
      rehash: true
    })

    for (const contract of contracts) {
      this.addChild(contract, {
        // For performance reasons. If this is set to true,
        // then we would re-build the contract N times, where
        // N is the number of contracts passed to this function.
        // Intead, we can prevent re-building and only do it
        // once when the function completes.
        rehash: false,
        rebuild: false
      })
    }

    this.rebuild()
    if (options.rehash) {
      this.hash()
    }

    return this
  }

  /**
   * @summary Recursively get the list of types known children contract types
   * @function
   * @name module:contrato.Contract#getChildrenTypes
   * @public
   *
   * @returns {Set} types
   *
   * @example
   * const contract = new Contract({ ... })
   * contract.addChildren([ { ... }, { ... } ])
   * console.log(contract.getChildrenTypes())
   */
  getChildrenTypes () {
    const types = new Set(this.metadata.children.types)

    for (const contract of this.getChildren()) {
      for (const type of contract.getChildrenTypes()) {
        types.add(type)
      }
    }

    return types
  }

  /**
   * @summary Get a single child by its hash
   * @function
   * @name module:contrato.Contract#getChildByHash
   * @public
   *
   * @param {String} childHash - child contract hash
   * @returns {(Object|Undefined)} child
   *
   * @example
   * const contract = new Contract({ ... })
   * contract.addChildren([ ... ])
   *
   * const child = contract.getChildByHash('xxxxxxx')
   *
   * if (child) {
   *   console.log(child)
   * }
   */
  getChildByHash (childHash) {
    return this.metadata.children.map[childHash]
  }

  /**
   * @summary Recursively get a set of children contracts
   * @function
   * @name module:contrato.Contract#getChildren
   * @public
   *
   * @param {Object} [options] - options
   * @param {Set} [options.types] - children types (all by default)
   * @returns {Object[]} children
   *
   * @example
   * const contract = new Contract({ ... })
   * const children = contract.getChildren({
   *   types: new Set([ 'arch.sw' ])
   * })
   *
   * for (const child of children) {
   *   console.log(child)
   * }
   */
  getChildren (options = {}) {
    return _.reduce(this.metadata.children.map, (accumulator, contract) => {
      if (!options.types || options.types.has(contract.raw.type)) {
        accumulator.push(contract)
      }

      return accumulator.concat(contract.getChildren(options))
    }, [])
  }

  /**
   * @summary Get all the children contracts of a specific type
   * @function
   * @name module:contrato.Contract#getChildrenByType
   * @public
   *
   * @param {String} type - contract type
   * @returns {Object[]} children
   *
   * @example
   * const contract = new Contract({ ... })
   * contract.addChildren([ ... ])
   * const children = container.getChildrenByType('sw.os')
   *
   * children.forEach((child) => {
   *   console.log(child)
   * })
   */
  getChildrenByType (type) {
    if (!this.metadata.children.typeMatchers[type]) {
      this.metadata.children.typeMatchers[type] = Contract.createMatcher({
        type
      })
    }

    return this.findChildren(this.metadata.children.typeMatchers[type])
  }

  /**
   * @summary Recursively find children using a matcher contract
   * @function
   * @name module:contrato.Contract#findChildren
   * @public
   *
   * @param {Object} matcher - matcher contract
   * @returns {Object[]} children
   *
   * @example
   * const contract = new Contract({ ... })
   * contract.addChildren([ ... ])
   *
   * const children = contract.findChildren(Contract.createMatcher({
   *   type: 'sw.os',
   *   slug: 'debian'
   * }))
   *
   * children.forEach((child) => {
   *   console.log(child)
   * })
   */
  findChildren (matcher) {
    if (!matcher.raw || !this.getChildrenTypes().has(matcher.raw.data.type)) {
      return []
    }

    const cache = this.metadata.children.searchCache.get(matcher)
    if (cache) {
      return cache
    }

    const results = []
    const type = matcher.raw.data.type
    const slug = matcher.raw.data.slug

    for (const contract of this.getChildren().concat([ this ])) {
      if (!contract.metadata.children.types.has(type)) {
        continue
      }

      // We need to omit the slug from the matcher object, otherwise
      // matchers that use an alias as a slug will never match the
      // structure of the actual contract.
      // Notice we do use the slug key separately, in order to obtain
      // the list of hashes we should check against.
      const matches = _.matches(_.omit(matcher.raw.data, [ 'slug', 'version' ]))
      const versionMatch = matcher.raw.data.version

      const hashes = slug
        ? contract.metadata.children.byTypeSlug[type][slug] || new Set()
        : contract.metadata.children.byType[type]

      // Means that we are matching just the type
      if (Object.keys(matcher.raw.data).length === 1) {
        for (const childHash of hashes) {
          results.push(contract.getChildByHash(childHash))
        }
      } else {
        for (const childHash of hashes) {
          const child = contract.getChildByHash(childHash)
          if (matches(child.raw)) {
            if (versionMatch) {
              if (semver.validRange(versionMatch)) {
                if (semver.satisfies(child.raw.version, versionMatch)) {
                  results.push(child)
                }
              } else if (_.isEqual(child.raw.version, versionMatch)) {
                results.push(child)
              }
              continue
            }
            results.push(child)
          }
        }
      }
    }

    this.metadata.children.searchCache.add(matcher, results)
    return results
  }

  /**
   * @summary Get all possible combinations from a type of children contracts
   * @function
   * @name module:contrato.Contract#getChildrenCombinations
   * @public
   *
   * @description
   * Note that the client is responsible for evaluating that the
   * combination of contracts is valid with regards to requirements,
   * conflicts, etc. This function simply returns all the possible
   * combinations without any further checks.
   *
   * The combinations output by this function is a plain list of
   * contracts from which you can create a contract, or any other
   * application specific data structure.
   *
   * @param {Object} options - options
   * @param {String} options.type - contract type
   * @param {Number} options.from - number of contracts per combination (from)
   * @param {Number} options.to - number of contracts per combination (to)
   * @returns {Array[]} combinations
   *
   * @example
   * const contract = new Contract({ ... })
   * contract.addChildren([
   *   new Contract({
   *     name: 'Debian Wheezy',
   *     version: 'wheezy',
   *     slug: 'debian',
   *     type: 'sw.os'
   *   }),
   *   new Contract({
   *     name: 'Debian Jessie',
   *     version: 'jessie',
   *     slug: 'debian',
   *     type: 'sw.os'
   *   }),
   *   new Contract({
   *     name: 'Fedora 25',
   *     version: '25',
   *     slug: 'fedora',
   *     type: 'sw.os'
   *   })
   * ])
   *
   * const combinations = contract.getChildrenCombinations({
   *   type: 'sw.os',
   *   from: 2,
   *   to: 2
   * })
   *
   * console.log(combinations)
   * > [
   * >   [
   * >     new Contract({
   * >       name: 'Debian Wheezy',
   * >       version: 'wheezy',
   * >       slug: 'debian',
   * >       type: 'sw.os'
   * >     }),
   * >     new Contract({
   * >       name: 'Debian Jessie',
   * >       version: 'jessie',
   * >       slug: 'debian',
   * >       type: 'sw.os'
   * >     })
   * >   ],
   * >   [
   * >     new Contract({
   * >       name: 'Debian Wheezy',
   * >       version: 'wheezy',
   * >       slug: 'debian',
   * >       type: 'sw.os'
   * >     }),
   * >     new Contract({
   * >       name: 'Fedora 25',
   * >       version: '25',
   * >       slug: 'fedora',
   * >       type: 'sw.os'
   * >     })
   * >   ],
   * >   [
   * >     new Contract({
   * >       name: 'Debian Jessie',
   * >       version: 'jessie',
   * >       slug: 'debian',
   * >       type: 'sw.os'
   * >     }),
   * >     new Contract({
   * >       name: 'Fedora 25',
   * >       version: '25',
   * >       slug: 'fedora',
   * >       type: 'sw.os'
   * >     })
   * >   ]
   * > ]
   */
  getChildrenCombinations (options) {
    let contracts = this.getChildrenByType(options.type)
    const cardinality = options.cardinality || options

    if (options.filter) {
      const filterValidator = _.partial(skhema.isValid, options.filter)
      contracts = _.filter(contracts, (con) => {
        return filterValidator(con.raw)
      })
    }

    if (contracts.length > 0) {
      if (options.version) {
        if (_.isEqual(options.version, 'latest')) {
          contracts.sort((left, right) => {
            return semver.compare(right.raw.version, left.raw.version)
          })
          contracts = contracts.slice(0, Math.min(contracts.length, cardinality.to))
        } else {
          contracts = _.filter(contracts, (con) => {
            return semver.satisfies(con.raw.version, options.version)
          })
        }
      }
    }

    if (contracts.length < cardinality.from) {
      throw new Error(`Invalid cardinality: ${cardinality.from} to ${cardinality.to}. ` +
                      `The number of ${options.type} contracts in ` +
                      `the universe is ${contracts.length}`)
    }

    if (cardinality.from > cardinality.to) {
      throw new Error(`Invalid cardinality: ${cardinality.from} to ${cardinality.to}. ` +
                      'The starting point is greater than the ending point')
    }

    const range = _.range(cardinality.from, Math.min(cardinality.to, contracts.length) + 1)
    return _.flatMap(range, (tcardinality) => {
      return combinatorics.bigCombination(contracts, tcardinality).toArray()
    })
  }

  /**
   * @summary Recursively get the list of referenced contracts
   * @function
   * @name module:contrato.Contract#getReferencedContracts
   * @public
   *
   * @param {Object} options - options
   * @param {Object} options.from - contract to resolve external contracts from
   * @param {Set} options.types - types to consider
   * @returns {Object[]} referenced contracts
   *
   * @example
   * const universe = new Contract({ ... })
   * universe.addChildren([ ... ])
   *
   * const contract = new Contract({ ... })
   * for (const reference of contract.getReferencedContracts({
   *   types: new Set([ 'arch.sw' ]),
   *   from: universe
   * })) {
   *   console.log(reference.toJSON())
   * }
   */
  getReferencedContracts (options) {
    const references = {}

    for (const type of options.types) {
      if (!this.metadata.requirements.types.has(type)) {
        continue
      }

      references[type] = []
      const matchers = this.metadata.requirements.matchers[type].getAll()

      for (const matcher of matchers) {
        for (const find of options.from.findChildren(matcher)) {
          references[find.getType()].push(find)

          const nested = find.getReferencedContracts(options)
          for (const nestedType of Object.keys(nested)) {
            for (const contract of nested[nestedType]) {
              references[nestedType].push(contract)
            }
          }
        }
      }
    }

    return references
  }

  /**
   * @summary Get the children cross referenced contracts
   * @function
   * @name module:contrato.Contract#getChildrenCrossReferencedContracts
   * @public
   *
   * @param {Object} options - options
   * @param {Object} options.from - contract to resolve external contracts from
   * @param {Set} options.types - types to consider
   * @returns {Object[]} children cross referenced contracts
   *
   * @example
   * const contract = new Contract({ ... })
   *
   * contract.addChildren([
   *   new Contract({
   *     type: 'arch.sw',
   *     slug: 'armv7hf',
   *     name: 'armv7hf'
   *   }),
   *   new Contract({
   *     type: 'sw.os',
   *     slug: 'raspbian',
   *     requires: [
   *       {
   *         or: [
   *           {
   *             type: 'arch.sw',
   *             slug: 'armv7hf'
   *           },
   *           {
   *             type: 'arch.sw',
   *             slug: 'rpi'
   *           }
   *         ]
   *       }
   *     ]
   *   }),
   *   new Contract({
   *     type: 'sw.stack',
   *     slug: 'nodejs',
   *     requires: [
   *       {
   *         type: 'arch.sw',
   *         slug: 'armv7hf'
   *       }
   *     ]
   *   })
   * ])
   *
   * const references = contract.getChildrenCrossReferencedContracts({
   *   from: contract,
   *   types: new Set([ 'arch.sw' ])
   * })
   *
   * console.log(references)
   * > [
   * >   Contract {
   * >     type: 'arch.sw',
   * >     slug: 'armv7hf',
   * >     name: 'armv7hf'
   * >   }
   * > ]
   */
  getChildrenCrossReferencedContracts (options) {
    const result = {}

    for (const contract of this.getChildren()) {
      const references = contract.getReferencedContracts(options)
      for (const type of Object.keys(references)) {
        if (!result[type]) {
          result[type] = []
        }

        result[type].push(references[type])
      }
    }

    return _.reduce(result, (accumulator, value) => {
      return accumulator.concat(_.intersectionWith(...value, Contract.isEqual))
    }, [])
  }


  /**
   * @summary Check if a child contract is satisfied when applied to this contract
   * @function
   * @name module:contrato.Contract#satisfiesChildContract
   * @public
   *
   * @param {Object} contract - child contract
   * @param {Object} [options] - options
   * @param {Set} [options.types] - the types to consider (all by default)
   * @returns {Boolean} whether the contract is satisfied
   *
   * @example
   * const contract = new Contract({ ... })
   * contract.addChildren([
   *   new Contract({
   *     type: 'sw.os',
   *     name: 'Debian Wheezy',
   *     version: 'wheezy',
   *     slug: 'debian'
   *   }),
   *   new Contract({
   *     type: 'sw.os',
   *     name: 'Fedora 25',
   *     version: '25',
   *     slug: 'fedora'
   *   })
   * ])
   *
   * const child = new Contract({
   *   type: 'sw.stack',
   *   name: 'Node.js',
   *   version: '4.8.0',
   *   slug: 'nodejs',
   *   requires: [
   *     {
   *       or: [
   *         {
   *           type: 'sw.os',
   *           slug: 'debian'
   *         },
   *         {
   *           type: 'sw.os',
   *           slug: 'fedora'
   *         }
   *       ]
   *     }
   *   ]
   * })
   *
   * if (contract.satisfiesChildContract(child)) {
   *   console.log('The child contract is satisfied!')
   * }
   */
  getNotSatisfiedChildRequirements (contract, options = {}) {
    const conjuncts = _.reduce(contract.getChildren(), (accumulator, child) => {
      return accumulator.concat(child.metadata.requirements.compiled.getAll())
    }, contract.metadata.requirements.compiled.getAll())

    // (1) If the top level list of conjuncts is empty,
    // then we can assume the requirements are fulfilled
    // and stop without doing any further computations.
    if (conjuncts.length === 0) {
      return []
    }

    // Utilities
    const shouldEvaluateType = options.types
      ? (type) => {
        return options.types.has(type)
      }
      : _.constant(true)

    const requirements = []
    /**
     * @summary Check if a matcher is satisfied
     * @function
     * @public
     *
     * @param {Object} matcher - matcher contract
     * @returns {Boolean} whether the matcher is satisfied
     *
     * @example
     * const matcher = Contract.createMatcher({
     *   type: 'sw.os',
     *   slug: 'debian'
     * })
     *
     * if (hasMatch(matcher)) {
     *   console.log('This matcher is satisfied!')
     * }
     */
    const hasMatch = (matcher) => {
      // TODO: Write a function similar to findContracts
      // that stops as soon as it finds one match
      return this.findChildren(matcher).length > 0
    }

    // (2) The requirements are specified as a list of objects,
    // so lets iterate through those.
    // This function uses a for loop instead of a more functional
    // construct for performance reasons, given that we can freely
    // break out of the loop as soon as possible.
    for (const conjunct of conjuncts) {
      if (conjunct.raw.operation === 'or') {
        // (3.1) Note that we should only consider disjuncts
        // of types we are allowed to check. We can make
        // such transformation here, so we can then consider
        // the disjunction as fulfilled if there are no
        // remaining disjuncts.
        const disjuncts = _.filter(conjunct.raw.data.getAll(), (disjunct) => {
          return shouldEvaluateType(disjunct.raw.data.type)
        })

        // (3.2) An empty disjuction means that this particular
        // requirement is fulfilled, so we can carry on.
        // A disjunction naturally contains a list of further
        // requirements we need to check for. If at least one
        // of the members is fulfilled, we can proceed with
        // next requirement.
        if (disjuncts.length === 0 || _.some(_.map(disjuncts, hasMatch))) {
          continue
        }

        // (3.3) If no members were fulfilled, then we know
        // that this requirement was not fullfilled, so it will be returned
        requirements.push(conjunct.raw.data)
      }

      // (4) If we should evaluate this requirement and it is not fullfilled
      // it will be returned
      if (shouldEvaluateType(conjunct.raw.data.type) && !hasMatch(conjunct)) {
        requirements.push(conjunct.raw.data)
      } else if (!shouldEvaluateType(conjunct.raw.data.type)) {
        // If this requirement is not evaluated, because of missing contracts,
        // it will also be returned.
        requirements.push(conjunct.raw.data)
      }
    }

    // (5) If we reached this far, then it means that all the
    // requirements were checked, and they were all satisfied,
    // so this is good to go!
    return requirements
  }

  /**
   * @summary Check if a child contract is satisfied when applied to this contract
   * @function
   * @name module:contrato.Contract#satisfiesChildContract
   * @public
   *
   * @param {Object} contract - child contract
   * @param {Object} [options] - options
   * @param {Set} [options.types] - the types to consider (all by default)
   * @returns {Boolean} whether the contract is satisfied
   *
   * @example
   * const contract = new Contract({ ... })
   * contract.addChildren([
   *   new Contract({
   *     type: 'sw.os',
   *     name: 'Debian Wheezy',
   *     version: 'wheezy',
   *     slug: 'debian'
   *   }),
   *   new Contract({
   *     type: 'sw.os',
   *     name: 'Fedora 25',
   *     version: '25',
   *     slug: 'fedora'
   *   })
   * ])
   *
   * const child = new Contract({
   *   type: 'sw.stack',
   *   name: 'Node.js',
   *   version: '4.8.0',
   *   slug: 'nodejs',
   *   requires: [
   *     {
   *       or: [
   *         {
   *           type: 'sw.os',
   *           slug: 'debian'
   *         },
   *         {
   *           type: 'sw.os',
   *           slug: 'fedora'
   *         }
   *       ]
   *     }
   *   ]
   * })
   *
   * if (contract.satisfiesChildContract(child)) {
   *   console.log('The child contract is satisfied!')
   * }
   */
  satisfiesChildContract (contract, options = {}) {
    const conjuncts = _.reduce(contract.getChildren(), (accumulator, child) => {
      return accumulator.concat(child.metadata.requirements.compiled.getAll())
    }, contract.metadata.requirements.compiled.getAll())

    // (1) If the top level list of conjuncts is empty,
    // then we can assume the requirements are fulfilled
    // and stop without doing any further computations.
    if (conjuncts.length === 0) {
      return true
    }

    // Utilities
    const shouldEvaluateType = options.types
      ? (type) => {
        return options.types.has(type)
      }
      : _.constant(true)

    /**
     * @summary Check if a matcher is satisfied
     * @function
     * @public
     *
     * @param {Object} matcher - matcher contract
     * @returns {Boolean} whether the matcher is satisfied
     *
     * @example
     * const matcher = Contract.createMatcher({
     *   type: 'sw.os',
     *   slug: 'debian'
     * })
     *
     * if (hasMatch(matcher)) {
     *   console.log('This matcher is satisfied!')
     * }
     */
    const hasMatch = (matcher) => {
      // TODO: Write a function similar to findContracts
      // that stops as soon as it finds one match
      return this.findChildren(matcher).length > 0
    }

    // (2) The requirements are specified as a list of objects,
    // so lets iterate through those.
    // This function uses a for loop instead of a more functional
    // construct for performance reasons, given that we can freely
    // break out of the loop as soon as possible.
    for (const conjunct of conjuncts) {
      if (conjunct.raw.operation === 'or') {
        // (3.1) Note that we should only consider disjuncts
        // of types we are allowed to check. We can make
        // such transformation here, so we can then consider
        // the disjunction as fulfilled if there are no
        // remaining disjuncts.
        const disjuncts = _.filter(conjunct.raw.data.getAll(), (disjunct) => {
          return shouldEvaluateType(disjunct.raw.data.type)
        })

        // (3.2) An empty disjuction means that this particular
        // requirement is fulfilled, so we can carry on.
        // A disjunction naturally contains a list of further
        // requirements we need to check for. If at least one
        // of the members is fulfilled, we can proceed with
        // next requirement.
        if (disjuncts.length === 0 || _.some(_.map(disjuncts, hasMatch))) {
          continue
        }

        // (3.3) If no members were fulfilled, then we know
        // the whole contract is unsatisfied, so there's no
        // reason to keep checking the remaining requirements.
        return false
      }

      // (4) If we reached this point, then we know we're dealing
      // with a conjunct from the top level *AND* operator.
      // Since a logical "and" means that all elements must be
      // fulfilled, we can return right away if one of these
      // was not satisfied.
      if (shouldEvaluateType(conjunct.raw.data.type) && !hasMatch(conjunct)) {
        return false
      }
    }

    // (5) If we reached this far, then it means that all the
    // requirements were checked, and they were all satisfied,
    // so this is good to go!
    return true
  }

  /**
   * @summary Check if the contract children are satisfied
   * @function
   * @name module:contrato.Contract#areChildrenSatisfied
   * @public
   *
   * @param {Object} [options] - options
   * @param {Set} [options.types] - the types to consider (all by default)
   * @returns {Boolean} whether the children are satisfied
   *
   * @example
   * const contract = new Contract({ ... })
   * contract.addChildren([ ... ])
   *
   * if (contract.areChildrenSatisfied({
   *   types: new Set([ 'sw.arch' ])
   * })) {
   *   console.log('This contract has all sw.arch requirements satisfied')
   * }
   */
  areChildrenSatisfied (options = {}) {
    for (const contract of this.getChildren()) {
      // The contract object keeps track of which contract
      // types the contract references in the requirements.
      // If we specified a set of types and we know this
      // contract is not interested in them, then we can
      // continue and avoid traversing through all the
      // requirements in vain.
      if (options.types && utils.areSetsDisjoint(options.types,
        contract.metadata.requirements.types)) {
        continue
      }

      if (!this.satisfiesChildContract(contract, {
        types: options.types
      })) {
        return false
      }
    }

    return true
  }

  /**
   *
   * @param {@summary} options
   */
  getAllNotSatisfiedChildRequirements (options = {}) {
    let requirements = [];
    for (const contract of this.getChildren()) {
      // The contract object keeps track of which contract
      // types the contract references in the requirements.
      // If we specified a set of types and we know this
      // contract is not interested in them, then we can
      // continue and avoid traversing through all the
      // requirements in vain.
      if (options.types && utils.areSetsDisjoint(options.types,
        contract.metadata.requirements.types)) {
        requirements = _.concat(requirements, _.map(contract.metadata.requirements.compiled.getAll(), 'data'))
        continue
      }

      const contractRequirements = this.getNotSatisfiedChildRequirements(contract, {
        types: options.types
      })
      requirements = _.concat(requirements, contractRequirements)
    }

    return requirements
  }


  /**
   * @summary Create a matcher contract object
   * @function
   * @static
   * @name module:contrato.Contract.createMatcher
   * @protected
   *
   * @param {(Object|Object[])} data - matcher data
   * @param {Object} [options] - options
   * @param {String} [options.operation] - the matcher's operation
   * @returns {Object} matcher contract
   *
   * @example
   * const matcher = Contract.createMatcher({
   *   type: 'arch.sw',
   *   slug: 'armv7hf'
   * })
   */
  static createMatcher (data, options = {}) {
    return new Contract({
      type: TYPES.MATCHER,
      operation: options.operation,
      data
    })
  }

  /**
   * @summary Check if two contracts are equal
   * @function
   * @static
   * @name module:contrato.Contract.isEqual
   * @public
   *
   * @param {Object} contract1 - a contract
   * @param {Object} contract2 - a contract
   * @returns {Boolean} whether the contracts are equal
   *
   * @example
   * const contract1 = new Contract({ ... })
   * const contract2 = new Contract({ ... })
   *
   * if (Contract.isEqual(contract1, contract2)) {
   *   console.log('These contracts are equal')
   * }
   */
  static isEqual (contract1, contract2) {
    if (contract1.metadata.hash && contract2.metadata.hash) {
      return contract1.metadata.hash === contract2.metadata.hash
    }

    return _.isEqual(contract1.raw, contract2.raw)
  }

  /**
   * @summary Build a source contract
   * @function
   * @static
   * @name module:contrato.Contract.build
   * @public
   *
   * @param {Object} source - source contract
   * @returns {Object[]} built contracts
   *
   * @example
   * const contracts = Contract.build({
   *   name: 'debian {{version}}',
   *   slug: 'debian',
   *   type: 'sw.os',
   *   variants: [
   *     { version: 'wheezy' },
   *     { version: 'jessie' },
   *     { version: 'sid' }
   *   ]
   * })
   *
   * contracts.forEach((contract) => {
   *   if (contract instanceof Contract) {
   *     console.log('This is a built contract')
   *   }
   * })
   */
  static build (source) {
    const rawContracts = variants.build(source)
    return _.chain(rawContracts).reduce((accumulator, variant) => {
      const aliases = variant.aliases || []
      const obj = _.omit(variant, [ 'aliases' ])
      const contracts = _.map(aliases, (alias) => {
        return new Contract(Object.assign({}, obj, {
          canonicalSlug: obj.slug,
          slug: alias
        }))
      })
      contracts.push(new Contract(obj))
      return accumulator.concat(contracts)
    }, [])
      .value()
  }
}

module.exports = Contract
