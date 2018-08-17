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

const ava = require('ava')
const partials = require('../../lib/partials')
const Contract = require('../../lib/contract')

ava.test('should find a partial in a one level structure with one contract of a type', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  contract.addChildren([
    new Contract({
      type: 'arch.sw',
      name: 'armv7hf',
      slug: 'armv7hf'
    })
  ])

  test.deepEqual(partials.findPartial('my-partial', contract, {
    baseDirectory: 'path/to/partials',
    structure: [ 'arch.sw' ]
  }), [
    'path/to/partials/armv7hf/my-partial.tpl',
    'path/to/partials/my-partial.tpl'
  ])
})

ava.test('should find a partial in a one level structure with one alias contract of a type', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  contract.addChildren([
    new Contract({
      type: 'arch.sw',
      name: 'armv7hf',
      slug: 'armhf',
      canonicalSlug: 'armv7hf'
    })
  ])

  test.deepEqual(partials.findPartial('my-partial', contract, {
    baseDirectory: 'path/to/partials',
    structure: [ 'arch.sw' ]
  }), [
    'path/to/partials/armv7hf/my-partial.tpl',
    'path/to/partials/my-partial.tpl'
  ])
})

ava.test('should find a partial in a one level structure with two alias contracts of a type', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  contract.addChildren([
    new Contract({
      type: 'arch.sw',
      name: 'armv7hf',
      slug: 'armhf',
      canonicalSlug: 'armv7hf'
    }),
    new Contract({
      type: 'arch.sw',
      name: 'armel',
      slug: 'armv5e',
      canonicalSlug: 'armel'
    })
  ])

  test.deepEqual(partials.findPartial('my-partial', contract, {
    baseDirectory: 'path/to/partials',
    structure: [ 'arch.sw' ]
  }), [
    'path/to/partials/armel+armv7hf/my-partial.tpl',
    'path/to/partials/my-partial.tpl'
  ])
})

ava.test('should find a partial in a one level structure with two contracts of a type with one right version', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  contract.addChildren([
    new Contract({
      type: 'arch.sw',
      version: '3',
      name: 'armv7hf',
      slug: 'armv7hf'
    }),
    new Contract({
      type: 'arch.sw',
      name: 'armel',
      slug: 'armel'
    })
  ])

  test.deepEqual(partials.findPartial('my-partial', contract, {
    baseDirectory: 'path/to/partials',
    structure: [ 'arch.sw' ]
  }), [
    'path/to/partials/armel+armv7hf@3/my-partial.tpl',
    'path/to/partials/armel+armv7hf/my-partial.tpl',
    'path/to/partials/my-partial.tpl'
  ])
})

ava.test('should find a partial in a one level structure with two contracts of a type with one right version', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  contract.addChildren([
    new Contract({
      type: 'arch.sw',
      version: '3',
      name: 'armv7hf',
      slug: 'armv7hf'
    }),
    new Contract({
      type: 'arch.sw',
      name: 'armel',
      slug: 'armel'
    })
  ])

  test.deepEqual(partials.findPartial('my-partial', contract, {
    baseDirectory: 'path/to/partials',
    structure: [ 'arch.sw' ]
  }), [
    'path/to/partials/armel+armv7hf@3/my-partial.tpl',
    'path/to/partials/armel+armv7hf/my-partial.tpl',
    'path/to/partials/my-partial.tpl'
  ])
})

ava.test('should find a partial in a one level structure with two contracts of a type with one right alias', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  contract.addChildren([
    new Contract({
      type: 'arch.sw',
      version: '3',
      name: 'armv7hf',
      slug: 'armhf',
      canonicalSlug: 'armv7hf'
    }),
    new Contract({
      type: 'arch.sw',
      name: 'armel',
      slug: 'armel'
    })
  ])

  test.deepEqual(partials.findPartial('my-partial', contract, {
    baseDirectory: 'path/to/partials',
    structure: [ 'arch.sw' ]
  }), [
    'path/to/partials/armel+armv7hf@3/my-partial.tpl',
    'path/to/partials/armel+armv7hf/my-partial.tpl',
    'path/to/partials/my-partial.tpl'
  ])
})

ava.test('should find a partial in a one level structure with two contracts of a type with one left version', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  contract.addChildren([
    new Contract({
      type: 'arch.sw',
      name: 'armv7hf',
      slug: 'armv7hf'
    }),
    new Contract({
      type: 'arch.sw',
      version: '3',
      name: 'armel',
      slug: 'armel'
    })
  ])

  test.deepEqual(partials.findPartial('my-partial', contract, {
    baseDirectory: 'path/to/partials',
    structure: [ 'arch.sw' ]
  }), [
    'path/to/partials/armel@3+armv7hf/my-partial.tpl',
    'path/to/partials/armel+armv7hf/my-partial.tpl',
    'path/to/partials/my-partial.tpl'
  ])
})

ava.test('should find a partial in a one level structure with two contracts of a type with one left alias', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  contract.addChildren([
    new Contract({
      type: 'arch.sw',
      name: 'armv7hf',
      slug: 'armhf',
      canonicalSlug: 'armv7hf'
    }),
    new Contract({
      type: 'arch.sw',
      version: '3',
      name: 'armel',
      slug: 'armel'
    })
  ])

  test.deepEqual(partials.findPartial('my-partial', contract, {
    baseDirectory: 'path/to/partials',
    structure: [ 'arch.sw' ]
  }), [
    'path/to/partials/armel@3+armv7hf/my-partial.tpl',
    'path/to/partials/armel+armv7hf/my-partial.tpl',
    'path/to/partials/my-partial.tpl'
  ])
})

ava.test('should find a partial in a one level structure with two contracts of a type with two versions', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  contract.addChildren([
    new Contract({
      type: 'arch.sw',
      version: '1',
      name: 'armv7hf',
      slug: 'armv7hf'
    }),
    new Contract({
      type: 'arch.sw',
      version: '3',
      name: 'armel',
      slug: 'armel'
    })
  ])

  test.deepEqual(partials.findPartial('my-partial', contract, {
    baseDirectory: 'path/to/partials',
    structure: [ 'arch.sw' ]
  }), [
    'path/to/partials/armel@3+armv7hf@1/my-partial.tpl',
    'path/to/partials/armel+armv7hf/my-partial.tpl',
    'path/to/partials/my-partial.tpl'
  ])
})

ava.test('should find a partial in a one level structure with one contract of a type with a version', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  contract.addChildren([
    new Contract({
      type: 'arch.sw',
      name: 'armv7hf',
      version: '3',
      slug: 'armv7hf'
    })
  ])

  test.deepEqual(partials.findPartial('my-partial', contract, {
    baseDirectory: 'path/to/partials',
    structure: [ 'arch.sw' ]
  }), [
    'path/to/partials/armv7hf@3/my-partial.tpl',
    'path/to/partials/armv7hf/my-partial.tpl',
    'path/to/partials/my-partial.tpl'
  ])
})

ava.test('should find a partial in a two level structure with one contract of each type', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  contract.addChildren([
    new Contract({
      type: 'arch.sw',
      name: 'armv7hf',
      slug: 'armv7hf'
    }),
    new Contract({
      type: 'hw.device-type',
      name: 'Raspberry Pi 3',
      slug: 'raspberrypi3'
    })
  ])

  test.deepEqual(partials.findPartial('my-partial', contract, {
    baseDirectory: 'path/to/partials',
    structure: [ 'hw.device-type', 'arch.sw' ]
  }), [
    'path/to/partials/raspberrypi3+armv7hf/my-partial.tpl',
    'path/to/partials/raspberrypi3/my-partial.tpl',
    'path/to/partials/my-partial.tpl'
  ])
})

ava.test('should find a partial in a two level structure with one contract of each type with versions', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  contract.addChildren([
    new Contract({
      type: 'arch.sw',
      version: '1',
      name: 'armv7hf',
      slug: 'armv7hf'
    }),
    new Contract({
      type: 'hw.device-type',
      name: 'Raspberry Pi 3',
      version: 'rev1',
      slug: 'raspberrypi3'
    })
  ])

  test.deepEqual(partials.findPartial('my-partial', contract, {
    baseDirectory: 'path/to/partials',
    structure: [ 'hw.device-type', 'arch.sw' ]
  }), [
    'path/to/partials/raspberrypi3@rev1+armv7hf@1/my-partial.tpl',
    'path/to/partials/raspberrypi3@rev1+armv7hf/my-partial.tpl',
    'path/to/partials/raspberrypi3+armv7hf@1/my-partial.tpl',
    'path/to/partials/raspberrypi3+armv7hf/my-partial.tpl',
    'path/to/partials/raspberrypi3@rev1/my-partial.tpl',
    'path/to/partials/raspberrypi3/my-partial.tpl',
    'path/to/partials/my-partial.tpl'
  ])
})

ava.test('should find a partial in a three level structure with one contract of each type', (test) => {
  const contract = new Contract({
    type: 'foo',
    slug: 'bar'
  })

  contract.addChildren([
    new Contract({
      type: 'arch.sw',
      name: 'armv7hf',
      slug: 'armv7hf'
    }),
    new Contract({
      type: 'hw.device-type',
      name: 'Raspberry Pi 3',
      slug: 'raspberrypi3'
    }),
    new Contract({
      type: 'sw.os',
      name: 'Debian Wheezy',
      slug: 'debian'
    })
  ])

  test.deepEqual(partials.findPartial('my-partial', contract, {
    baseDirectory: 'path/to/partials',
    structure: [ 'hw.device-type', 'sw.os', 'arch.sw' ]
  }), [
    'path/to/partials/raspberrypi3+debian+armv7hf/my-partial.tpl',
    'path/to/partials/raspberrypi3+debian/my-partial.tpl',
    'path/to/partials/raspberrypi3/my-partial.tpl',
    'path/to/partials/my-partial.tpl'
  ])
})
