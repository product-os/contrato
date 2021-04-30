/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { expect } from '../chai';
import * as _ from 'lodash';
import { stripExtraBlankLines } from '../../lib/utils';

describe('stripExtraBlankLines', () => {
	it('should replace two blank lines with one', () => {
		const result = _.split(
			stripExtraBlankLines(
				_.join(['Hello', '', '', 'World', '', '', '!'], '\n'),
			),
			'\n',
		);

		expect(result).to.deep.equal(['Hello', '', 'World', '', '!']);
	});

	it('should replace three blank lines with one', () => {
		const result = _.split(
			stripExtraBlankLines(
				_.join(['Hello', '', '', '', 'World', '', '', '', '!'], '\n'),
			),
			'\n',
		);

		expect(result).to.deep.equal(['Hello', '', 'World', '', '!']);
	});

	it('should remove a single leading blank line', () => {
		const result = _.split(
			stripExtraBlankLines(_.join(['', 'Hello'], '\n')),
			'\n',
		);

		expect(result).to.deep.equal(['Hello']);
	});

	it('should remove two leading blank lines', () => {
		const result = _.split(
			stripExtraBlankLines(_.join(['', '', 'Hello'], '\n')),
			'\n',
		);

		expect(result).to.deep.equal(['Hello']);
	});

	it('should remove a single trailing blank line', () => {
		const result = _.split(
			stripExtraBlankLines(_.join(['Hello', ''], '\n')),
			'\n',
		);

		expect(result).to.deep.equal(['Hello']);
	});

	it('should remove two trailing blank lines', () => {
		const result = _.split(
			stripExtraBlankLines(_.join(['Hello', '', ''], '\n')),
			'\n',
		);

		expect(result).to.deep.equal(['Hello']);
	});
});
