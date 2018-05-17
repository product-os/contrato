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
 * }
 */
exports.checkValidContract = (contract, schema) => {
  let success = false
  if (schema) {
    success = ajv.validate(mergeWithBase(schema), contract)
  } else {
    success = ajv.validate('contract.json', contract)
  }

  if (success) {
    return true
  }
  throw new Error(ajv.errorsText())
}
