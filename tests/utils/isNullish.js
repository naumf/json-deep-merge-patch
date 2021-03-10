'use strict'

const { suite } = require('uvu')
const assert = require('uvu/assert')
const { isNullish } = require('../../src/utils')

const testSuite = suite('isNullish')

testSuite('should be a function', () => {
  assert.type(isNullish, 'function')
})

testSuite('should be true if value is null', () => {
  assert.is(isNullish(null), true)
})

testSuite('should be true if value is undefined', () => {
  assert.is(isNullish(undefined), true)
})

testSuite('should be false', () => {
  assert.is(isNullish(0), false)
  assert.is(isNullish(false), false)
  assert.is(isNullish(1), false)
})

testSuite.run()
