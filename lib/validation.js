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

const Ajv = require('ajv')
const ajv = new Ajv({
  schemaId: '$id'
})
const baseContractSchema = require('./schema/contract.json')
ajv.addSchema(baseContractSchema)

// eslint-disable-next-line jsdoc/require-example
/**
 * @summary Merge supplied schema with base contract schema
 * @function
 * @private
 *
 * @param {Object} schema - JSON schema
 * @returns {Object} - Merged schema
 *
 */
const mergeWithBase = (schema) => {
  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: schema.$id,
    allOf: [
      {
        $ref: 'contract.json'
      },
      schema
    ]
  }
}

/**
 * @module validation
 */

/**
 * @summary Checks if a contract is valid.
 * @function
 * @memberof module:validation
 * @public
 *
 * @param {Object} contract - the contract to validate
 * @param {Object} schema - optional schema
 * @returns {Object} result
 *
 * @description
 * This function will validate that the supplied contract is valid according to
 * the json schema specification. Accepts an optional schema that can reference and extend
 * the base schema. If a custom schema is passed, both the generic and custom validation
 * rules will apply
 *
 * @example
 * validation.checkContract({
 *   slug: 'slug',
 *   type: 'type',
 *   version: '1',
 *   componentVersion: 'componentVersion',
 *   aliases: [],
 *   data: {},
 *   tags: []
 * }
 */
exports.checkContract = (contract, schema) => {
  let success = false
  if (schema) {
    success = ajv.validate(mergeWithBase(schema), contract)
  } else {
    success = ajv.validate('contract.json', contract)
  }

  if (success) {
    return {
      success: true, errors: []
    }
  }
  return {
    success: false, errors: [ ajv.errorsText() ]
  }
}
