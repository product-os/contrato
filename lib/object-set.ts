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
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hash'.
const hash = require('./hash');
/**
 * @ignore
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ObjectSet'... Remove this comment to see the full error message
class ObjectSet {
    cache: any;
    data: any;
    /**
     * @summary A data structure to represent a set of objects
     * @name ObjectSet
     * @class
     * @private
     *
     * @param {(Object[]|Array[])} [objects] - initial objects
     *
     * @example
     * const set = new ObjectSet([
     *   { ... },
     *   { ... },
     *   { ... }
     * ])
     */
    constructor(objects = []) {
        this.cache = {
            size: 0
        };
        this.data = {};
        for (const object of objects) {
            if (_.isArray(object)) {
                this.add(_.first(object), _.last(object));
            }
            else {
                this.add(object);
            }
        }
    }
    /**
     * @summary Add an object to the set
     * @function
     * @public
     *
     * @param {Object} object - object
     * @param {Object} [options] - options
     * @param {String} [options.id] - custom unique id for the object
     *
     * @example
     * const set = new ObjectSet()
     * set.add({ foo: 'bar' })
     * set.add({ foo: 'baz' }, { id: 'myuniqueid' })
     */
    add(object, options = {}) {
        const id = (options as any).id || hash.hashObject(object);
        if (this.hasId(id)) {
            return;
        }
        this.data[id] = object;
        this.cache.size++;
    }
    /**
     * @summary Get the current size of the set
     * @function
     * @public
     *
     * @returns {Number} size
     *
     * @example
     * const set = new ObjectSet()
     *
     * if (set.size() === 0) {
     *   console.log('This set is empty')
     * }
     */
    size() {
        return this.cache.size;
    }
    /**
     * @summary Check if the set has a certain object
     * @function
     * @public
     *
     * @param {Object} object - object
     * @returns {Boolean} whether the set has the object
     *
     * @example
     * const set = new ObjectSet([
     *   { foo: 'bar' }
     * ])
     *
     * if (set.hasObject({ foo: 'bar' })) {
     *   console.log('This object is there!')
     * }
     */
    hasObject(object) {
        return Boolean(this.data[hash.hashObject(object)]);
    }
    /**
     * @summary Check if the set has a certain id
     * @function
     * @public
     *
     * @param {String} id - id
     * @returns {Boolean} whether the set has the id
     *
     * @example
     * const set = new ObjectSet()
     * set.add({ foo: 'bar' }, { id: 'foo' })
     *
     * if (set.hasId('foo')) {
     *   console.log('This id is there!')
     * }
     */
    hasId(id) {
        return Boolean(this.data[id]);
    }
    /**
     * @summary Get all the objects in the set
     * @function
     * @public
     *
     * @returns {Object[]} all the objects in the set
     *
     * @example
     * const set = new ObjectSet([
     *   { ... },
     *   { ... },
     *   { ... }
     * ])
     *
     * set.getAll().forEach((object) => {
     *   console.log(object)
     * })
     */
    getAll() {
        return _.values(this.data);
    }
    /**
     * @summary Calculate the intersection between two object sets
     * @function
     * @public
     *
     * @param {Object} set - object set
     * @returns {Object} intersection set
     *
     * @example
     * const set1 = new ObjectSet([
     *   { foo: 'bar' }
     *   { bar: 'baz' }
     * ])
     *
     * const set2 = new ObjectSet([
     *   { bar: 'baz' }
     * ])
     *
     * set1.intersection(set2)
     *
     * console.log(set1.getAll())
     * > [
     * >   { bar: 'baz' }
     * > ]
     */
    intersection(set) {
        for (const id of Object.keys(this.data)) {
            if (!set.hasId(id)) {
                Reflect.deleteProperty(this.data, id);
            }
        }
        return this;
    }
}
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ObjectSet;
