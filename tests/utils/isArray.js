'use strict'

const { suite } = require('uvu')
const assert = require('uvu/assert')
const { isArray } = require('../../src/utils')

const testSuite = suite('isArray')

testSuite('should be a function', () => {
  assert.type(isArray, 'function')
})

testSuite('should be true', () => {
  assert.is(isArray([1]), true)
})

testSuite('should be false', () => {
  assert.is(isArray({ 1: 'value' }), false)
})

testSuite.run()
