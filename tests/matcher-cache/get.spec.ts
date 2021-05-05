/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { expect } from '../chai';

import MatcherCache from '../../lib/matcher-cache';
import Contract from '../../lib/contract';

describe('MatcherCache get', () => {
	it('should return the value if the matcher was cached', () => {
		const cache = new MatcherCache();

		const matcher1 = Contract.createMatcher({
			type: 'sw.os',
			slug: 'debian',
		});

		cache.add(matcher1, {
			matcher: 'debian',
		});

		expect(cache.get(matcher1)).to.deep.equal({
			matcher: 'debian',
		});
	});

	it('should return null if the matcher was not cached', () => {
		const cache = new MatcherCache();

		const matcher1 = Contract.createMatcher({
			type: 'sw.os',
			slug: 'debian',
		});

		const matcher2 = Contract.createMatcher({
			type: 'sw.os',
			slug: 'fedora',
		});

		cache.add(matcher1, {
			matcher: 'debian',
		});

		expect(cache.get(matcher2)).to.deep.equal(null);
	});
});
