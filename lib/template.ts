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
'use strict';
/**
 * @module template
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
/**
 * @summary Map object values recursively
 * @function
 * @private
 *
 * @param {Object} object - object
 * @param {Function} callback - callback (value)
 * @param {String[]} [breadcrumb] - location breadcrumb
 * @returns {Object} mapped object
 *
 * @example
 * const result = deepMapValues({
 *   a: 1,
 *   b: 2,
 *   c: 3
 * }, (value) => {
 *   return value * 2
 * })
 *
 * console.log(result)
 * > {
 * >   a: 2
 * >   b: 4
 * >   c: 6
 * > }
 */
const deepMapValues = (object, callback, breadcrumb = []) => {
    if (!_.isPlainObject(object)) {
        return callback(object, breadcrumb);
    }
    return _.mapValues(object, (value, key) => {
        const absoluteKey = _.concat(breadcrumb, [key]);
        if (_.isPlainObject(value)) {
            return deepMapValues(value, callback, absoluteKey);
        }
        return callback(value, absoluteKey);
    });
};
/**
 * @summary Contract template interpolation regex
 * @type {RegExp}
 * @constant
 */
const TEMPLATE_REGEXP = /\{\{(.+?)\}\}/g;
/**
 * @summary Compile contract templates
 * @function
 * @public
 * @memberof module:template
 *
 * @param {Object} contract - contract
 * @param {Object} [options] - options
 * @param {Set} [options.blacklist] - paths to ignore
 * @param {Object} [root] - template root (internally used during recursion)
 * @param {String[]} [breadcrumb] - breadcrumb (internally used during recursion)
 * @returns {Object} applied contract
 *
 * @example
 * const contract = template.compileContract({
 *   type: 'distro',
 *   name: 'debian {{this.version}}',
 *   version: 'wheezy',
 *   slug: 'debian'
 * })
 *
 * console.log(contract)
 * > {
 * >   type: 'distro',
 * >   name: 'debian wheezy',
 * >   version: 'wheezy',
 * >   slug: 'debian'
 * > }
 */
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.compileContract = (contract, options = {}, root, breadcrumb) => {
    return deepMapValues(contract, (value, key) => {
        if (_.isString(value)) {
            if ((options as any).blacklist) {
                for (const path of (options as any).blacklist) {
                    if (key.join('.').startsWith(path)) {
                        return value;
                    }
                }
            }
            const data = {
                this: root || contract
            };
            return value.replace(TEMPLATE_REGEXP, (interpolation, path) => {
                return _.get(data, path) || interpolation;
            });
        }
        if (_.isArray(value)) {
            return _.map(value, (object, index) => {
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
                return exports.compileContract(object, options, contract, _.concat(key, [index]));
            });
        }
        return value;
    }, breadcrumb);
};
