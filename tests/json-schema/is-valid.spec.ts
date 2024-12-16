/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { expect } from '../chai';

import { isValid } from '../../lib/json-schema';

describe('JSONSchema isValid', () => {
	it('should return true if there is a match', () => {
		const result = isValid(
			{
				type: 'object',
			},
			{
				foo: 'bar',
			},
		);
		expect(result).to.be.true;
	});

	it('should return false if the is no match', () => {
		const result = isValid(
			{
				type: 'object',
				properties: {
					foo: {
						type: 'number',
					},
				},
			},
			{
				foo: 'bar',
			},
		);
		expect(result).to.be.false;
	});

	it('should pass if unknown format is used', () => {
		const testValue = 'foobar';

		expect(
			isValid(
				{
					type: 'string',
					format: 'foobar',
				},
				testValue,
			),
		).to.be.true;
	});
});
