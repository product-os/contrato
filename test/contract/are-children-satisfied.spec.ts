/*
 * Copyright 2017 resin.io
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

import test from 'ava';

import Contract from '../../lib/contract';

test('should return true given a satisfied context', (test) => {
	const contract = new Contract({
		type: 'foo',
		bar: 'bar'
	})

	contract.addChildren([
		new Contract({
			type: 'sw.os',
			name: 'Debian',
			slug: 'debian',
			requires: [
				{
					or: [
						{
							type: 'hw.device-type',
							slug: 'artik10'
						},
						{
							type: 'hw.device-type',
							slug: 'raspberry-pi'
						}
					]
				}
			]
		}),
		new Contract({
			type: 'hw.device-type',
			slug: 'artik10',
			name: 'Samsung Artik 10',
			requires: [
				{
					type: 'arch.sw',
					slug: 'armv7hf'
				}
			]
		}),
		new Contract({
			type: 'arch.sw',
			slug: 'armv7hf',
			name: 'armv7hf'
		})
	])

	test.true(contract.areChildrenSatisfied())
})

test('should return false given an unsatisfied context', (test) => {
	const contract = new Contract({
		type: 'foo',
		bar: 'bar'
	})

	contract.addChildren([
		new Contract({
			type: 'sw.os',
			name: 'Debian',
			slug: 'debian',
			requires: [
				{
					or: [
						{
							type: 'hw.device-type',
							slug: 'artik10'
						},
						{
							type: 'hw.device-type',
							slug: 'raspberry-pi'
						}
					]
				}
			]
		}),
		new Contract({
			type: 'hw.device-type',
			slug: 'artik10',
			name: 'Samsung Artik 10',
			requires: [
				{
					type: 'arch.sw',
					slug: 'amd64'
				}
			]
		}),
		new Contract({
			type: 'arch.sw',
			slug: 'armv7hf',
			name: 'armv7hf'
		})
	])

	test.false(contract.areChildrenSatisfied())
})

test('should return false given a requirement over a contract that does not exist', (test) => {
	const contract = new Contract({
		type: 'foo',
		bar: 'bar'
	})

	contract.addChildren([
		new Contract({
			type: 'sw.os',
			name: 'Debian',
			slug: 'debian',
			requires: [
				{
					type: 'hw.device-type',
					slug: 'artik10'
				}
			]
		})
	])

	test.false(contract.areChildrenSatisfied())
})

test('should return true given a requirement over a contract that does not ' +
				 'exist for which the type was not passed', (test) => {
	const contract = new Contract({
		type: 'foo',
		bar: 'bar'
	})

	contract.addChildren([
		new Contract({
			type: 'sw.os',
			name: 'Debian',
			slug: 'debian',
			requires: [
				{
					type: 'hw.device-type',
					slug: 'artik10'
				}
			]
		})
	])

	test.true(contract.areChildrenSatisfied({
		types: new Set([ 'arch.sw' ])
	}))
})

test('should return true given one satisfied type in a satisfied context', (test) => {
	const contract = new Contract({
		type: 'foo',
		bar: 'bar'
	})

	contract.addChildren([
		new Contract({
			type: 'sw.os',
			name: 'Debian',
			slug: 'debian',
			requires: [
				{
					or: [
						{
							type: 'hw.device-type',
							slug: 'artik10'
						},
						{
							type: 'hw.device-type',
							slug: 'raspberry-pi'
						}
					]
				}
			]
		}),
		new Contract({
			type: 'hw.device-type',
			slug: 'artik10',
			name: 'Samsung Artik 10',
			requires: [
				{
					type: 'arch.sw',
					slug: 'armv7hf'
				}
			]
		}),
		new Contract({
			type: 'arch.sw',
			slug: 'armv7hf',
			name: 'armv7hf'
		})
	])

	test.true(contract.areChildrenSatisfied({
		types: new Set([ 'hw.device-type' ])
	}))
})

test('should return true given one satisfied type in an unsatisfied context', (test) => {
	const contract = new Contract({
		type: 'foo',
		bar: 'bar'
	})

	contract.addChildren([
		new Contract({
			type: 'sw.os',
			name: 'Debian',
			slug: 'debian',
			requires: [
				{
					or: [
						{
							type: 'hw.device-type',
							slug: 'intel-edison'
						},
						{
							type: 'hw.device-type',
							slug: 'raspberry-pi'
						}
					]
				}
			]
		}),
		new Contract({
			type: 'hw.device-type',
			slug: 'artik10',
			name: 'Samsung Artik 10',
			requires: [
				{
					type: 'arch.sw',
					slug: 'armv7hf'
				}
			]
		}),
		new Contract({
			type: 'arch.sw',
			slug: 'armv7hf',
			name: 'armv7hf'
		})
	])

	test.true(contract.areChildrenSatisfied({
		types: new Set([ 'arch.sw' ])
	}))
})

test('should return true given one unknown type in an unsatisfied context', (test) => {
	const contract = new Contract({
		type: 'foo',
		bar: 'bar'
	})

	contract.addChildren([
		new Contract({
			type: 'sw.os',
			name: 'Debian',
			slug: 'debian',
			requires: [
				{
					or: [
						{
							type: 'hw.device-type',
							slug: 'intel-edison'
						},
						{
							type: 'hw.device-type',
							slug: 'raspberry-pi'
						}
					]
				}
			]
		}),
		new Contract({
			type: 'hw.device-type',
			slug: 'artik10',
			name: 'Samsung Artik 10',
			requires: [
				{
					type: 'arch.sw',
					slug: 'armv7hf'
				}
			]
		}),
		new Contract({
			type: 'arch.sw',
			slug: 'armv7hf',
			name: 'armv7hf'
		})
	])

	test.true(contract.areChildrenSatisfied({
		types: new Set([ 'foo' ])
	}))
})

test('should return false given one unsatisfied type in an unsatisfied context', (test) => {
	const contract = new Contract({
		type: 'foo',
		bar: 'bar'
	})

	contract.addChildren([
		new Contract({
			type: 'sw.os',
			name: 'Debian',
			slug: 'debian',
			requires: [
				{
					or: [
						{
							type: 'hw.device-type',
							slug: 'intel-edison'
						},
						{
							type: 'hw.device-type',
							slug: 'raspberry-pi'
						}
					]
				}
			]
		}),
		new Contract({
			type: 'hw.device-type',
			slug: 'artik10',
			name: 'Samsung Artik 10',
			requires: [
				{
					type: 'arch.sw',
					slug: 'armv7hf'
				}
			]
		}),
		new Contract({
			type: 'arch.sw',
			slug: 'armv7hf',
			name: 'armv7hf'
		})
	])

	test.false(contract.areChildrenSatisfied({
		types: new Set([ 'hw.device-type' ])
	}))
})

test('should return false given one unsatisfied and one satisfied type in an unsatisfied context', (test) => {
	const contract = new Contract({
		type: 'foo',
		bar: 'bar'
	})

	contract.addChildren([
		new Contract({
			type: 'sw.os',
			name: 'Debian',
			slug: 'debian',
			requires: [
				{
					or: [
						{
							type: 'hw.device-type',
							slug: 'intel-edison'
						},
						{
							type: 'hw.device-type',
							slug: 'raspberry-pi'
						}
					]
				}
			]
		}),
		new Contract({
			type: 'hw.device-type',
			slug: 'artik10',
			name: 'Samsung Artik 10',
			requires: [
				{
					type: 'arch.sw',
					slug: 'armv7hf'
				}
			]
		}),
		new Contract({
			type: 'arch.sw',
			slug: 'armv7hf',
			name: 'armv7hf'
		})
	])

	test.false(contract.areChildrenSatisfied({
		types: new Set([ 'arch.sw', 'hw.device-type' ])
	}))
})

test('should return true given two satisfied types in a satisfied context', (test) => {
	const contract = new Contract({
		type: 'foo',
		bar: 'bar'
	})

	contract.addChildren([
		new Contract({
			type: 'sw.os',
			name: 'Debian',
			slug: 'debian',
			requires: [
				{
					or: [
						{
							type: 'hw.device-type',
							slug: 'artik10'
						},
						{
							type: 'hw.device-type',
							slug: 'raspberry-pi'
						}
					]
				}
			]
		}),
		new Contract({
			type: 'hw.device-type',
			slug: 'artik10',
			name: 'Samsung Artik 10',
			requires: [
				{
					type: 'arch.sw',
					slug: 'armv7hf'
				}
			]
		}),
		new Contract({
			type: 'arch.sw',
			slug: 'armv7hf',
			name: 'armv7hf'
		})
	])

	test.true(contract.areChildrenSatisfied({
		types: new Set([ 'arch.sw', 'hw.device-type' ])
	}))
})

test('should return true given a context with other satisfied contexts', (test) => {
	const container = new Contract({
		type: 'foo',
		bar: 'bar'
	})

	const contract1 = new Contract({
		type: 'child',
		slug: 'child-1'
	})

	const contract2 = new Contract({
		type: 'child',
		slug: 'child-2'
	})

	const contract3 = new Contract({
		type: 'child',
		slug: 'child-3'
	})

	contract1.addChild(new Contract({
		type: 'sw.os',
		name: 'Debian',
		slug: 'debian',
		requires: [
			{
				type: 'hw.device-type',
				slug: 'artik10'
			}
		]
	}))

	contract2.addChild(new Contract({
		type: 'hw.device-type',
		slug: 'artik10',
		name: 'Samsung Artik 10',
		requires: [
			{
				type: 'arch.sw',
				slug: 'armv7hf'
			}
		]
	}))

	contract3.addChild(new Contract({
		type: 'arch.sw',
		slug: 'armv7hf',
		name: 'armv7hf'
	}))

	container.addChildren([ contract1, contract2, contract3 ])
	test.true(container.areChildrenSatisfied())
})

test('should return false given a context with unsatisfied contexts', (test) => {
	const container = new Contract({
		type: 'foo',
		bar: 'bar'
	})

	const contract1 = new Contract({
		type: 'child',
		slug: 'child-1'
	})

	const contract2 = new Contract({
		type: 'child',
		slug: 'child-2'
	})

	const contract3 = new Contract({
		type: 'child',
		slug: 'child-3'
	})

	contract1.addChild(new Contract({
		type: 'sw.os',
		name: 'Debian',
		slug: 'debian',
		requires: [
			{
				type: 'hw.device-type',
				slug: 'artik10'
			}
		]
	}))

	contract2.addChild(new Contract({
		type: 'hw.device-type',
		slug: 'artik10',
		name: 'Samsung Artik 10',
		requires: [
			{
				type: 'arch.sw',
				slug: 'armv7hf'
			}
		]
	}))

	contract3.addChild(new Contract({
		type: 'arch.sw',
		slug: 'armel',
		name: 'armel'
	}))

	container.addChildren([ contract1, contract2, contract3 ])
	test.false(container.areChildrenSatisfied())
})
