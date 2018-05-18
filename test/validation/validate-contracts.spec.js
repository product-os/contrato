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
  componentVersion: 'componentVersion',
  aliases: [],
  data: {},
  tags: []
}

ava.test('should validate base contract', (test) => {
  test.is(true, validation.checkValidContract(baseContract))
})

ava.test('should reject invalid base contract', (test) => {
  test.throws(() => {
    validation.checkValidContract(_.omit(baseContract, 'slug'))
  }, 'data should have required property \'.slug\'')
})

const extendedSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'extended.schema',
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
  }
}

const extendedContract = _.merge({}, baseContract, {
  data:
    {
      test: 'test'
    }
})

ava.test('should validate extended contract', (test) => {
  test.is(true, validation.checkValidContract(extendedContract, extendedSchema))
})

ava.test('Should reject invald extended contract', (test) => {
  test.throws(() => {
    validation.checkValidContract(baseContract, extendedSchema)
  }, 'data.data should have required property \'test\'')
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

const overlappingContract = _.merge({}, baseContract, {
  data: {
    test: 'test'
  }
})

ava.test('should validate overlapping contract', (test) => {
  test.is(true, validation.checkValidContract(overlappingContract, overlappingSchema))
})

ava.test('Should reject invald overlapping contract', (test) => {
  test.throws(() => {
    validation.checkValidContract(baseContract, overlappingSchema)
  }, 'data.data should have required property \'test\'')
})

ava.test('Should reject invald overlapping contract', (test) => {
  test.throws(() => {
    validation.checkValidContract(_.omit(overlappingContract, 'data.test'), overlappingSchema)
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

const referencingContract = _.merge({}, baseContract, {
  data: baseContract
})

ava.test('should validate self referencing contract', (test) => {
  test.is(true, validation.checkValidContract(referencingContract, referencingSchema))
})

ava.test('Should reject invald self referencing contract', (test) => {
  test.throws(() => {
    validation.checkValidContract(_.omit(referencingContract, 'data.slug'), referencingSchema)
  }, 'data.data should have required property \'.slug\'')
})

const taggedContract = _.merge({}, baseContract, {
  tags: [ 'valid' ]
})

ava.test('Should validate tagged contract', (test) => {
  test.is(true, validation.checkValidContract(taggedContract))
})

ava.test('Should reject invald tagged contract', (test) => {
  taggedContract.tags.push('valid')

  test.throws(() => {
    validation.checkValidContract(taggedContract)
  }, 'data.tags should NOT have duplicate items (items ## 1 and 0 are identical)')
})

ava.test('Should reject invald tagged contract', (test) => {
  taggedContract.tags.push(' non valid ')

  test.throws(() => {
    validation.checkValidContract(taggedContract)
  }, 'data.tags[2] should match pattern "^[\\S]+(?: [\\S]+)*$"')
})

const requireContract = _.merge({}, baseContract, {
  requires: [
    {
      or: [
        { type: 'type' },
        {
          or: [
            {
              slug: 'slug'
            }
          ]
        }
      ]
    }
  ]
})

const externalRequireContract = _.merge({}, baseContract, {
  requires: [
    { data:
      {
        a: 'a'
      }
    }
  ]
})

const badExternalRequireContract = _.merge({}, baseContract, {
  requires: [
    {
      or: [
        { type: 'type' },
        {
          or: [
            {
              a: 'a'
            }
          ]
        }
      ]
    }
  ]
})

const badExternalRequireContract2 = _.merge({}, baseContract, {
  requires: [
    {
      or: [
        { version: 'version' },
      ]
    }
  ]
})

ava.test('should validate require contract', (test) => {
  test.is(true, validation.checkValidContract(requireContract))
})

ava.test('should validate require contract with unknown fields', (test) => {
  test.is(true, validation.checkValidContract(externalRequireContract))
})

ava.test('should reject bad require contract with unknown fields', (test) => {
  test.throws(() => {
    validation.checkValidContract(badExternalRequireContract)
  })
})

ava.test('should reject bad require contract that only specifies version', (test) => {
  test.throws(() => {
    validation.checkValidContract(badExternalRequireContract2)
  })
})

const capabilitiesContract = _.merge({}, baseContract, {
  capabilities: [
    {
      'slug': 'slug',
      'componentVersion': 'componentVersion'
    },
    {
      'slug': 'slug'
    }
  ]
})

const badCapabilitiesContract = _.merge({}, baseContract, {
  capabilities: [
    {
      'componentVersion': 'componentVersion'
    }
  ]
})

ava.test('should validate capabilities contract', (test) => {
  test.is(true, validation.checkValidContract(capabilitiesContract))
})

ava.test('should reject bad capabilities contract', (test) => {
  test.throws(() => {
    validation.checkValidContract(badCapabilitiesContract)
  }, 'data.capabilities[0] should have required property \'slug\'')
})

const conflictsContract = _.merge({}, baseContract, {
  conflicts: [
    {
      'slug': 'slug',
      'version': 'version'
    },
    {
      'slug': 'slug'
    }
  ]
})

const badConflictsContract = _.merge({}, baseContract, {
  conflicts: [
    {
      'a': 'a'
    }
  ]
})

ava.test('should validate conflicts contract', (test) => {
  test.is(true, validation.checkValidContract(conflictsContract))
})

ava.test('should reject bad conflicts contract', (test) => {
  test.throws(() => {
    validation.checkValidContract(badConflictsContract)
  }, 'data.conflicts[0] should NOT have additional properties')
})

const assetsContract = _.merge({}, baseContract, {
  assets: {
    a: {
      url: 'https://test.url',
      checksum: 'checksum',
      checksumType: 'sha256'
    }
  }
})

ava.test('should validate assets contract', (test) => {
  test.is(true, validation.checkValidContract(assetsContract))
})

ava.test('should reject bad assets contract', (test) => {
  test.throws(() => {
    validation.checkValidContract(_.omit(assetsContract, 'assets.a.url'))
  }, 'data.assets[\'a\'] should have required property \'url\'')
})

ava.test('should reject bad assets contract', (test) => {
  test.throws(() => {
    validation.checkValidContract(_.omit(assetsContract, 'assets.a.checksumType'))
  }, 'data.assets[\'a\'] should have property checksumType when property checksum is present')
})
