/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { expect } from '../chai';
import * as _ from 'lodash';
import { parse } from '../../lib/cardinality';

describe('parse cardinality', () => {
	_.each(
		[
			// Fixed points

			{
				input: [1, 1],
				expected: {
					from: 1,
					to: 1,
					finite: true,
				},
			},
			{
				input: [2, 2],
				expected: {
					from: 2,
					to: 2,
					finite: true,
				},
			},
			{
				input: [3, 3],
				expected: {
					from: 3,
					to: 3,
					finite: true,
				},
			},

			// Finite ranges

			{
				input: [1, 2],
				expected: {
					from: 1,
					to: 2,
					finite: true,
				},
			},
			{
				input: [2, 3],
				expected: {
					from: 2,
					to: 3,
					finite: true,
				},
			},
			{
				input: [1, 3],
				expected: {
					from: 1,
					to: 3,
					finite: true,
				},
			},

			// Infinite ranges

			{
				input: [0, Infinity],
				expected: {
					from: 0,
					to: Infinity,
					finite: false,
				},
			},
			{
				input: [1, Infinity],
				expected: {
					from: 1,
					to: Infinity,
					finite: false,
				},
			},
			{
				input: [2, Infinity],
				expected: {
					from: 2,
					to: Infinity,
					finite: false,
				},
			},

			// Syntax sugar (asterisk notation)

			{
				input: [0, '*'],
				expected: {
					from: 0,
					to: Infinity,
					finite: false,
				},
			},
			{
				input: [1, '*'],
				expected: {
					from: 1,
					to: Infinity,
					finite: false,
				},
			},
			{
				// Surrounding whitespace
				input: [1, '   *   '],
				expected: {
					from: 1,
					to: Infinity,
					finite: false,
				},
			},
			{
				input: [3, '*'],
				expected: {
					from: 3,
					to: Infinity,
					finite: false,
				},
			},

			// Syntax sugar (number)

			{
				input: 1,
				expected: {
					from: 1,
					to: 1,
					finite: true,
				},
			},
			{
				input: 2,
				expected: {
					from: 2,
					to: 2,
					finite: true,
				},
			},
			{
				input: 3,
				expected: {
					from: 3,
					to: 3,
					finite: true,
				},
			},
			{
				input: '1',
				expected: {
					from: 1,
					to: 1,
					finite: true,
				},
			},
			{
				input: '2',
				expected: {
					from: 2,
					to: 2,
					finite: true,
				},
			},
			{
				input: '3',
				expected: {
					from: 3,
					to: 3,
					finite: true,
				},
			},
			{
				input: '546',
				expected: {
					from: 546,
					to: 546,
					finite: true,
				},
			},
			{
				input: '    3    ',
				expected: {
					from: 3,
					to: 3,
					finite: true,
				},
			},

			// Syntax sugar (plus sign)

			{
				input: '1+',
				expected: {
					from: 1,
					to: Infinity,
					finite: false,
				},
			},
			{
				input: '2+',
				expected: {
					from: 2,
					to: Infinity,
					finite: false,
				},
			},
			{
				input: '3+',
				expected: {
					from: 3,
					to: Infinity,
					finite: false,
				},
			},
			{
				input: '546+',
				expected: {
					from: 546,
					to: Infinity,
					finite: false,
				},
			},
			{
				input: '    3+     ',
				expected: {
					from: 3,
					to: Infinity,
					finite: false,
				},
			},
			{
				input: '3   +',
				expected: {
					from: 3,
					to: Infinity,
					finite: false,
				},
			},

			// Syntax sugar (standalone asterisk)

			{
				input: '*',
				expected: {
					from: 0,
					to: Infinity,
					finite: false,
				},
			},
			{
				input: '   *  ',
				expected: {
					from: 0,
					to: Infinity,
					finite: false,
				},
			},

			// Syntax sugar (question sign)

			{
				input: '?',
				expected: {
					from: 0,
					to: 1,
					finite: true,
				},
			},
			{
				input: '  ?  ',
				expected: {
					from: 0,
					to: 1,
					finite: true,
				},
			},
			{
				input: '1?',
				expected: {
					from: 0,
					to: 1,
					finite: true,
				},
			},
			{
				input: '1  ?',
				expected: {
					from: 0,
					to: 1,
					finite: true,
				},
			},
		],
		(testCase) => {
			it(`should parse ${JSON.stringify(testCase.input)}`, () => {
				expect(parse(testCase.input)).to.deep.equal(testCase.expected);
			});
		},
	);

	_.each(
		[
			{
				input: [1, 2, 3],
				error: 'Invalid cardinality: 1,2,3',
			},
			{
				input: [1],
				error: 'Invalid cardinality: 1',
			},
			{
				input: [2, 1],
				error: 'Invalid cardinality: 2,1',
			},
			{
				input: [0, 0],
				error: 'Invalid cardinality: 0,0',
			},
			{
				input: [0, -1],
				error: 'Invalid cardinality: 0,-1',
			},
			{
				input: [-1, 0],
				error: 'Invalid cardinality: -1,0',
			},
			{
				input: [-5, -5],
				error: 'Invalid cardinality: -5,-5',
			},
			{
				input: ['*', 1],
				error: 'Invalid cardinality: *,1',
			},
			{
				input: ['1', '2'],
				error: 'Invalid cardinality: 1,2',
			},
			// Removed null test cases because they do not compile with required types
			// {
			//   input: [ '1', null ],
			//   error: 'Invalid cardinality: 1,'
			// },
			// {
			//   input: [ null, '1' ],
			//   error: 'Invalid cardinality: ,1'
			// },
			{
				input: [1.5, 1.5],
				error: 'Invalid cardinality: 1.5,1.5',
			},
		],
		(testCase) => {
			it(`should throw "${testCase.error}" given ${JSON.stringify(
				testCase.input,
			)}`, () => {
				expect(() => {
					parse(testCase.input);
				}).to.throw(testCase.error);
			});
		},
	);
});
