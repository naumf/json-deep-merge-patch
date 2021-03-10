'use strict'

const { suite } = require('uvu')
const assert = require('uvu/assert')
const { cloneArray } = require('../../src/utils')

const testSuite = suite('cloneObject')

testSuite('should be a function', () => {
  assert.type(cloneArray, 'function')
})

testSuite('should not be equal with original', () => {
  const arr = [
    {
      prop: 'value',
      prop2: null,
      prop3: [1]
    }
  ]

  assert.is.not(cloneArray(arr), arr)
  assert.is.not(cloneArray(arr)[0], arr[0])
})

testSuite('should not be equal with original (2)', () => {
  const arr = [
    {
      prop: 'value',
      prop2: null,
      prop3: [1, [2]],
      obj: {
        created: true,
        arr: [
          {
            obj: {
              data: 'string'
            }
          }
        ]
      }
    }
  ]

  assert.is.not(cloneArray(arr), arr)
  assert.is.not(cloneArray(arr)[0], arr[0])
  assert.is.not(cloneArray(arr)[0].obj, arr[0].obj)
  assert.is.not(cloneArray(arr)[0].obj.arr, arr[0].obj.arr)
  assert.is.not(cloneArray(arr)[0].obj.arr[0].obj, arr[0].obj.arr[0].obj)
})

testSuite.run()
