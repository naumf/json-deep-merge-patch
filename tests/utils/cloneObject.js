'use strict'

const { suite } = require('uvu')
const assert = require('uvu/assert')
const { cloneObject } = require('../../src/utils')

const testSuite = suite('cloneObject')

testSuite('should be a function', () => {
  assert.type(cloneObject, 'function')
})

testSuite('should not be equal with original', () => {
  const obj = {
    prop: 'value',
    prop2: null,
    prop3: [1]
  }

  assert.is.not(cloneObject(obj), obj)
})

testSuite('should not be equal with original (2)', () => {
  const obj = {
    obj: {
      prop: 'value'
    }
  }

  assert.is.not(cloneObject(obj), obj)
  assert.is.not(cloneObject(obj).obj, obj.obj)
})

testSuite.run()
