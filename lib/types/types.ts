/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import type { components } from './cuetypes';

export type ContractObject = components['schemas']['Contract'];
export type BlueprintObject = components['schemas']['Blueprint'];
export type BlueprintLayout = components['schemas']['BlueprintLayout'];

export const CONTEXT = 'meta.context';
export const UNIVERSE = 'meta.universe';
export const MATCHER = 'meta.matcher';
export const BLUEPRINT = 'meta.blueprint';
