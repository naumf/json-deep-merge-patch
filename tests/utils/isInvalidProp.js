'use strict'

const { suite } = require('uvu')
const assert = require('uvu/assert')
const { isInvalidProp } = require('../../src/utils')

const testSuite = suite('isObject')

testSuite('should be a function', () => {
  assert.type(isInvalidProp, 'function')
})

testSuite('should be true', () => {
  assert.is(isInvalidProp('__proto__'), true)
  assert.is(isInvalidProp('constructor'), true)
  assert.is(isInvalidProp('prototype'), true)
})

testSuite('should be false', () => {
  assert.is(isInvalidProp('undefined'), false)
})

testSuite.run()
