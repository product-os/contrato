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
const validation = require('../../lib/validation')

const baseContract = {
  slug: 'slug',
  type: 'type',
  version: 'version',
  name: 'name'
}

ava.test('should validate base contract', (test) => {
  test.is(true, validation.checkValidContract(baseContract))
})

ava.test('should reject invalid base contract', (test) => {
  test.throws(() => {
    validation.checkValidContract(_.omit(baseContract, 'slug'))
  }, 'data should have required property \'slug\'')
})

const extendedSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'extended.schema',
  type: 'object',
  properties: {
    test: {
      type: 'string'
    },
    optional: {
      type: 'string'
    }
  },
  required: [ 'test' ]
}

const extendedContract = {
  test: 'test'
}

ava.test('should validate extended contract', (test) => {
  test.is(true,
    validation.checkValidContract(_.merge({}, baseContract, extendedContract), extendedSchema))
})

ava.test('Should reject invald extended contract', (test) => {
  test.throws(() => {
    validation.checkValidContract(extendedContract, extendedSchema)
  }, 'data should have required property \'slug\'')
})

ava.test('Should reject invald extended contract', (test) => {
  test.throws(() => {
    validation.checkValidContract(baseContract, extendedSchema)
  }, 'data should have required property \'test\'')
})

const overlappingSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'overlapping.schema',
  type: 'object',
  properties: {
    data: {
      type: 'object',
      properties: {
        test: {
          type: 'string'
        },
        optional: {
          type: 'string'
        }
      },
      required: [ 'test' ]
    }
  },
  required: [ 'data' ]
}

const overlappingContract = {
  data: {
    test: 'test'
  }
}

ava.test('should validate overlapping contract', (test) => {
  test.is(true,
    validation.checkValidContract(_.merge({}, baseContract, overlappingContract), overlappingSchema))
})

ava.test('Should reject invald overlapping contract', (test) => {
  test.throws(() => {
    validation.checkValidContract(overlappingContract, overlappingSchema)
  }, 'data should have required property \'slug\'')
})

ava.test('Should reject invald overlapping contract', (test) => {
  test.throws(() => {
    validation.checkValidContract(baseContract, overlappingSchema)
  }, 'data should have required property \'data\'')
})

ava.test('Should reject invald overlapping contract', (test) => {
  test.throws(() => {
    validation.checkValidContract(_.merge({},
      baseContract,
      _.omit(overlappingContract, 'data.test')), overlappingSchema)
  }, 'data.data should have required property \'test\'')
})

const referencingSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'referencing.schema',
  type: 'object',
  properties: {
    data:
      {
        $ref: 'contract.json'
      }
  },
  required: [ 'data' ]
}

const referencingContract = {
  data: {
    slug: 'slug',
    type: 'type',
    version: 'version',
    name: 'name'
  }
}

ava.test('should validate self referencing contract', (test) => {
  test.is(true,
    validation.checkValidContract(_.merge({}, baseContract, referencingContract), referencingSchema))
})

ava.test('Should reject invald overlapping contract', (test) => {
  test.throws(() => {
    validation.checkValidContract(_.merge({},
      baseContract,
      _.omit(referencingContract, 'data.slug')), referencingSchema)
  }, 'data.data should have required property \'slug\'')
})

const taggedContract = {
  tags: [ 'valid' ]
}

ava.test('Should reject invald tagged contract', (test) => {
  test.is(true, validation.checkValidContract(_.merge({}, baseContract, taggedContract)))
})

ava.test('Should reject invald tagged contract', (test) => {
  taggedContract.tags.push('valid')

  test.throws(() => {
    validation.checkValidContract(_.merge({}, baseContract, taggedContract))
  }, 'data.tags should NOT have duplicate items (items ## 1 and 0 are identical)')
})

ava.test('Should reject invald tagged contract', (test) => {
  taggedContract.tags.push(' non valid ')

  test.throws(() => {
    validation.checkValidContract(_.merge({}, baseContract, taggedContract))
  }, 'data.tags[2] should match pattern "^[\\S]+(?: [\\S]+)*$"')
})
