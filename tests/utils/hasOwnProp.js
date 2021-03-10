'use strict'

const { suite } = require('uvu')
const assert = require('uvu/assert')
const { hasOwnProp } = require('../../src/utils')

const testSuite = suite('hasOwnProp')

testSuite('should be a function', () => {
  assert.type(hasOwnProp, 'function')
})

testSuite('should be true', () => {
  const obj = {
    prop: 'value'
  }

  assert.is(hasOwnProp(obj, 'prop'), true)
})

testSuite('should be false', () => {
  const Obj = function () {
    this.prop = 'value'
  }
  Obj.prototype.protoProp = 'value'
  const obj = new Obj()

  assert.is(hasOwnProp(obj, 'protoProp'), false)
})

testSuite.run()
