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
 * @module contrato
 * @public
 */

import { BlueprintType, ContractType } from './types/types';
import Contract from './contract';
import Blueprint from './blueprint';
import { buildTemplate } from './partials';
import { parse as parseCardinality } from './cardinality';

export {
	ContractType,
	BlueprintType,
	Contract,
	Blueprint,
	buildTemplate,
	parseCardinality,
};

export const query = (universe: Contract, layout: object, skeleton: object) =>
	new Blueprint(layout, skeleton).reproduce(universe);

export const sequence = (
	universe: Contract,
	layout: object,
	skeleton: object,
) => new Blueprint(layout, skeleton).sequence(universe);
