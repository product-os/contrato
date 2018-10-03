/*
 * Copyright 2018 resin.io
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

'use strict'

const ava = require('ava')
const _ = require('lodash')
const Blueprint = require('../../lib/blueprint')

ava.test('should transform a simple template', (test) => {
	const composite = Blueprint.transform({
		type: "device-type",
		slug: "raspberry-pi-{{this.children.myarch.slug}}",
		capabilities: {
			arch: "{{>this.children.myarch}}"
		},			
		consists_of: {
			myarch: {
				cardinality: 1,
				type: "sw.arch",
				slug: "arm6",
				version: "latest"
			}
		}
	})

	test.deepEqual(composite, {
		"skeleton": {
			"slug": "raspberry-pi-{{this.children.myarch.slug}}",
			"type": "device-type",
			"capabilities": {
				"arch": "{{>this.children.myarch}}"
			},
			"consists_of": {
				"myarch": "{{>this.children.myarch}}"
			}
		},
		"layout": {
			"myarch": {
				"cardinality": 1,
				"type": "sw.arch",
				"version": "latest",
				"filter": {
					"properties": {
						"slug": {
							"enum": [
								'arm6',
							],
							"type": 'string',
						},
					},
					"required": [
						'slug',
					],
					"type": 'object',
				},
			}
		}
	})
})

ava.test('should transform a simple template', (test) => {
	const composite = Blueprint.transform({
		"slug": "supervisor-{{this.children.build_for_arch.slug}}",
		"family": "supervisor",
		"version": "2.12",
		"type": "service-container",
		"requires": [
			{
				"type": "api",
				"slug": "resin-api",
				"version": "3+"
			},
			{
				"type": "{{this.children.build_for_arch.type}}",
				"slug": "{{this.children.build_for_arch.slug}}"
			}
		],
		"data": {
			"$build_for_arch": {
				"cardinality": 1,
				"type": "sw.arch",
				"version": "latest"
			}
		}
	})

	test.deepEqual(composite, {
		"skeleton": {
			"slug": "supervisor-{{this.children.build_for_arch.slug}}",
			"family": "supervisor",
			"version": "2.12",
			"type": "service-container",
			"requires": [
				{
					"type": "api",
					"slug": "resin-api",
					"version": "3+"
				},
				{
					"type": "{{this.children.build_for_arch.type}}",
					"slug": "{{this.children.build_for_arch.slug}}"
				}
			],
			"data": {
				"build_for_arch": "{{>this.children.build_for_arch}}"
			}
		},
		"layout": {
      "build_for_arch": {
        "cardinality": 1,
				"type": "sw.arch",
				"version": "latest"
      }
		}
	})
})

ava.test('should transform a simple template', (test) => {
	const composite = Blueprint.transform({
		"slug": "resinOS-{{this.children.supervisor.data.built_for_arch.slug}}",
		"type": "resinOS",
		"version": "2.15",
		"requires": [
			{
				"type": "api",
				"slug": "resin-api",
				"version": "3+"
			},
			{
				"type": "{{this.children.supervisor.data.built_for_arch.type}}",
				"slug": "{{this.children.supervisor.data.built_for_arch.slug}}"
			}
		],
		"consists_of": {
			"supervisor": {
				"cardinality": 1,
				"family": "supervisor",
				"version": "2.12",
				"type": "service-container"
			}
		}
	})
	
	test.deepEqual(composite, {
		"skeleton": {
			"slug": "resinOS-{{this.children.supervisor.data.built_for_arch.slug}}",
			"type": "resinOS",
			"version": "2.15",
			"requires": [
				{
					"type": "api",
					"slug": "resin-api",
					"version": "3+"
				},
				{
					"type": "{{this.children.supervisor.data.built_for_arch.type}}",
					"slug": "{{this.children.supervisor.data.built_for_arch.slug}}"
				}
			],
			"consists_of": {
				"supervisor": "{{>this.children.supervisor}}"
			}
		},
		"layout": {
      "supervisor": {
        "cardinality": 1,
				"version": "2.12",
				"type": "service-container",
				"filter": {
					"type": "object",
					"properties": {
						"family": {
							"type": "string",
							"enum": [ "supervisor" ]
						}
					},
					"required": [
						"family"
					]
				}
      }
		}
	})
})
