'use strict'

const { suite } = require('uvu')
const assert = require('uvu/assert')
const { isObject } = require('../../src/utils')

const testSuite = suite('isObject')

testSuite('should be a function', () => {
  assert.type(isObject, 'function')
})

testSuite('should be true', () => {
  assert.is(isObject({}), true)
})

testSuite('should be false', () => {
  assert.is(isObject(2), false)
})

testSuite.run()
