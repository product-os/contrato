/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

/**
 * @module contrato
 * @public
 */

import {
	BlueprintLayout,
	BlueprintObject,
	ContractObject,
} from './types/types';
import Contract from './contract';
import Blueprint from './blueprint';
import { buildTemplate } from './partials';
import { parse as parseCardinality } from './cardinality';

export {
	BlueprintLayout,
	ContractObject,
	BlueprintObject,
	Contract,
	Blueprint,
	buildTemplate,
	parseCardinality,
};

export const query = (
	universe: Contract,
	layout: BlueprintLayout,
	skeleton: object,
) => new Blueprint(layout, skeleton).reproduce(universe);

export const sequence = (
	universe: Contract,
	layout: BlueprintLayout,
	skeleton: object,
) => new Blueprint(layout, skeleton).sequence(universe);
