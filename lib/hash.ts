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
 * @module hash
 */

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const objectHash = require('object-hash')

/**
 * @summary Hash a JavaScript object
 * @function
 * @public
 * @memberof module:hash
 *
 * @param {Object} object - object
 * @returns {String} object hash
 *
 * @example
 * const string = hash.hashObject({ foo: 'bar' })
 * console.log(string)
 */
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.hashObject = (object) => {
  return objectHash(object, {
    algorithm: 'sha1',
    ignoreUnknown: true,

    // This in particular is a HUGE improvement
    respectType: false
  })
}
