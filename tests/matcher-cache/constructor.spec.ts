/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { expect } from '../chai';

import MatcherCache from '../../lib/matcher-cache';

describe('MatcherCache constructor', () => {
	it('should create an empty cache', () => {
		const cache = new MatcherCache();
		expect(cache.data).to.deep.equal({});
	});
});
