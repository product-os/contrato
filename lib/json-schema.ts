import AJV from 'ajv';
import addFormats from 'ajv-formats';
import type { JSONSchema6 } from 'json-schema';

// Adds extra formats to an AJV instance
const configureAjv = (ajv: AJV) => {
	// Add additional formats
	addFormats(ajv);
};

const JSON_SCHEMA_SCHEMA = {
	$schema: 'http://json-schema.org/draft-07/schema#',
	$id: 'contrato-meta-schema',
	title: 'Core schema meta-schema',
	definitions: {
		schemaArray: {
			type: 'array',
			minItems: 1,
			items: {
				$ref: '#',
			},
		},
		nonNegativeInteger: {
			type: 'integer',
			minimum: 0,
		},
		nonNegativeIntegerDefault0: {
			allOf: [
				{
					$ref: '#/definitions/nonNegativeInteger',
				},
				{
					default: 0,
				},
			],
		},
		simpleTypes: {
			enum: [
				'array',
				'boolean',
				'integer',
				'null',
				'number',
				'object',
				'string',
			],
		},
		stringArray: {
			type: 'array',
			items: {
				type: 'string',
			},
			uniqueItems: true,
			default: [],
		},
	},
	type: ['object', 'boolean'],
	properties: {
		$id: {
			type: 'string',
			format: 'uri-reference',
		},
		$schema: {
			type: 'string',
			format: 'uri',
		},
		$ref: {
			type: 'string',
			format: 'uri-reference',
		},
		$comment: {
			type: 'string',
		},
		title: {
			type: 'string',
		},
		description: {
			type: 'string',
		},
		default: true,
		readOnly: {
			type: 'boolean',
			default: false,
		},
		examples: {
			type: 'array',
			items: true,
		},
		multipleOf: {
			type: 'number',
			exclusiveMinimum: 0,
		},
		maximum: {
			type: 'number',
		},
		exclusiveMaximum: {
			type: 'number',
		},
		minimum: {
			type: 'number',
		},
		exclusiveMinimum: {
			type: 'number',
		},
		maxLength: {
			$ref: '#/definitions/nonNegativeInteger',
		},
		minLength: {
			$ref: '#/definitions/nonNegativeIntegerDefault0',
		},
		pattern: {
			type: 'string',
			format: 'regex',
		},
		additionalItems: {
			$ref: '#',
		},
		items: {
			anyOf: [
				{
					$ref: '#',
				},
				{
					$ref: '#/definitions/schemaArray',
				},
			],
			default: true,
		},
		maxItems: {
			$ref: '#/definitions/nonNegativeInteger',
		},
		minItems: {
			$ref: '#/definitions/nonNegativeIntegerDefault0',
		},
		uniqueItems: {
			type: 'boolean',
			default: false,
		},
		contains: {
			$ref: '#',
		},
		maxProperties: {
			$ref: '#/definitions/nonNegativeInteger',
		},
		minProperties: {
			$ref: '#/definitions/nonNegativeIntegerDefault0',
		},
		required: {
			$ref: '#/definitions/stringArray',
		},
		additionalProperties: {
			$ref: '#',
		},
		definitions: {
			type: 'object',
			additionalProperties: {
				$ref: '#',
			},
			default: {},
		},
		properties: {
			type: 'object',
			additionalProperties: {
				$ref: '#',
			},
			default: {},
		},
		patternProperties: {
			type: 'object',
			additionalProperties: {
				$ref: '#',
			},
			propertyNames: {
				format: 'regex',
			},
			default: {},
		},
		dependencies: {
			type: 'object',
			additionalProperties: {
				anyOf: [
					{
						$ref: '#',
					},
					{
						$ref: '#/definitions/stringArray',
					},
				],
			},
		},
		propertyNames: {
			$ref: '#',
		},
		const: true,
		enum: {
			type: 'array',
			items: true,
			minItems: 1,
			uniqueItems: true,
		},
		type: {
			anyOf: [
				{
					$ref: '#/definitions/simpleTypes',
				},
				{
					type: 'array',
					items: {
						$ref: '#/definitions/simpleTypes',
					},
					minItems: 1,
					uniqueItems: true,
				},
			],
		},
		format: {
			type: 'string',
		},
		contentMediaType: {
			type: 'string',
		},
		contentEncoding: {
			type: 'string',
		},
		if: {
			$ref: '#',
		},
		then: {
			$ref: '#',
		},
		else: {
			$ref: '#',
		},
		allOf: {
			$ref: '#/definitions/schemaArray',
		},
		anyOf: {
			$ref: '#/definitions/schemaArray',
		},
		oneOf: {
			$ref: '#/definitions/schemaArray',
		},
		not: {
			$ref: '#',
		},
	},
	default: true,
};

interface MatchOptions {
	/**
	 * Only validate the schema
	 */
	schemaOnly: boolean;
}

/**
 * @summary Match an object against a schema
 * @function
 *
 * @param schema - JSON schema
 * @param obj - object
 * @param [options] - options
 * @param  [options.schemaOnly=false] - Only validate the schema
 *
 * @example
 * const results = skhema.match({
 *	 type: 'object'
 * }, {
 *	 foo: 'bar'
 * })
 *
 * if (!results.valid) {
 *	 for (const error of results.errors) {
 *		 console.error(error)
 *	 }
 * }
 */
const match = (() => {
	const ajv = new AJV({
		allErrors: true,

		// See https://github.com/ajv-validator/ajv/issues/2198#issuecomment-1374882385
		// this is used in replacement of `unknownFormats: 'ignore'`
		strictSchema: false,

		// Don't keep references to all used
		// schemas in order to not leak memory.
		addUsedSchema: false,
	});

	ajv.addSchema(JSON_SCHEMA_SCHEMA, 'schema');

	configureAjv(ajv);

	return (
		schema: JSONSchema6,
		obj: unknown,
		options: Partial<MatchOptions> = { schemaOnly: true },
	) => {
		if (!schema) {
			return {
				valid: false,
				errors: ['no schema'],
			};
		}

		if (!ajv.validate('schema', schema)) {
			return {
				valid: false,
				errors: ['invalid schema'],
			};
		}

		const valid = options.schemaOnly ? true : ajv.validate(schema, obj);

		return {
			valid,
			errors: valid ? [] : ajv.errorsText().split(', '),
		};
	};
})();

/**
 * @summary Check if an object matches a schema
 * @function
 * @public
 *
 * @description
 * This is a shorthand function for `.match()` which can be used
 * if the caller is not interested in the actual error messages.
 *
 * @param  schema - JSON schema
 * @param  obj - object
 * @param  [options] - options
 * @param  [options.schemaOnly=false] - Only validate the schema
 * @returns whether the object matches the schema
 *
 * @example
 * const isValid = skhema.isValid({
 *	 type: 'object'
 * }, {
 *	 foo: 'bar'
 * })
 *
 * if (isValid) {
 *	 console.log('The object is valid')
 * }
 */
export function isValid(
	schema: JSONSchema6,
	obj: unknown,
	options: Partial<MatchOptions> = {},
) {
	return match(schema, obj, options).valid;
}
