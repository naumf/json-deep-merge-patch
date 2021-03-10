'use strict'

const Benchmark = require('benchmark')
const jsonDeepMergePatch = require('./index.js')
const jsonMergePatch = require('json-merge-patch')
const deepmerge = require('deepmerge')
const overwriteMerge = (destinationArray, sourceArray, options) => sourceArray
const v8 = require('v8')
function clone(obj) {
  return v8.deserialize(v8.serialize(obj))
}

const target = {
  type: 'object',
  properties: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    nickName: { type: 'string' },
    arr: [1, 2, 3],
    nested: {
      created: true,
      toBeDeleted: true,
      obj: {
        key: 'value'
      }
    }
  }
}

const patch = {
  properties: {
    email: { type: 'string', format: 'email' },
    nickName: null,
    arr: [1, 2],
    nested: {
      updated: true,
      toBeDeleted: null,
      date: new Date(),
      arrObj: [{ k: 'v' }],
      obj: {
        key: 'modified'
      }
    }
  }
}

const targetMutable = clone(target)
const patchMutable = clone(patch)

const suite = new Benchmark.Suite()

suite
  .add('jsonDeepMergePatch', function () {
    jsonDeepMergePatch(target, patch)
  })
  .add('jsonDeepMergePatch (cloneUnpatchedProps)', function () {
    jsonDeepMergePatch(target, patch, { cloneUnpatchedProps: true })
  })
  .add('jsonMergePatch#apply', function () {
    jsonMergePatch.apply(targetMutable, patchMutable)
  })
  .add('jsonMergePatch#apply (serialize)', function () {
    jsonMergePatch.apply(
      JSON.parse(JSON.stringify(target)),
      JSON.parse(JSON.stringify(patchMutable))
    )
  })
  .add('deepmerge', function () {
    deepmerge(target, patch)
  })
  .add('deepmerge (overwriteMerge)', function () {
    deepmerge(target, patch, { arrayMerge: overwriteMerge })
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run()
