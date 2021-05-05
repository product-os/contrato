/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { expect } from '../chai';

import MatcherCache from '../../lib/matcher-cache';
import Contract from '../../lib/contract';

describe('MatcherCache getTypes', () => {
	it('should return an empty set if the cache is empty', () => {
		const cache = new MatcherCache();
		expect(cache.getTypes()).to.deep.equal(new Set());
	});

	it('should return a single type if there is only one entry', () => {
		const cache = new MatcherCache();

		const matcher1 = Contract.createMatcher({
			type: 'sw.os',
			slug: 'debian',
		});

		cache.add(matcher1, true);

		expect(cache.getTypes()).to.deep.equal(new Set(['sw.os']));
	});

	it('should not return duplicated types', () => {
		const cache = new MatcherCache();

		const matcher1 = Contract.createMatcher({
			type: 'sw.os',
			slug: 'debian',
		});

		const matcher2 = Contract.createMatcher({
			type: 'sw.os',
			slug: 'fedora',
		});

		cache.add(matcher1, true);
		cache.add(matcher2, false);

		expect(cache.getTypes()).to.deep.equal(new Set(['sw.os']));
	});

	it('should return all added types', () => {
		const cache = new MatcherCache();

		const matcher1 = Contract.createMatcher({
			type: 'sw.os',
			slug: 'debian',
		});

		const matcher2 = Contract.createMatcher({
			type: 'sw.stack',
			slug: 'nodejs',
		});

		cache.add(matcher1, true);
		cache.add(matcher2, false);

		expect(cache.getTypes()).to.deep.equal(new Set(['sw.os', 'sw.stack']));
	});

	it('should not return reset types', () => {
		const cache = new MatcherCache();

		const matcher1 = Contract.createMatcher({
			type: 'sw.os',
			slug: 'debian',
		});

		const matcher2 = Contract.createMatcher({
			type: 'sw.stack',
			slug: 'nodejs',
		});

		cache.add(matcher1, true);
		cache.add(matcher2, false);

		cache.resetType('sw.stack');

		expect(cache.getTypes()).to.deep.equal(new Set(['sw.os']));
	});
});
