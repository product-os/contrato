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
 * @module contrato
 * @public
 */

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.Contract = require('./contract')

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.Blueprint = require('./blueprint')

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.buildTemplate = require('./partials').buildTemplate

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.parseCardinality = require('./cardinality').parse

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.query = (universe, layout, skeleton) => {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
  const blueprint = new exports.Blueprint(layout, skeleton)
  return blueprint.reproduce(universe)
}

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.sequence = (universe, layout, skeleton) => {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
  const blueprint = new exports.Blueprint(layout, skeleton)
  return blueprint.sequence(universe)
}
