'use strict'

const { suite } = require('uvu')
const assert = require('uvu/assert')
const jsonDeepMergePatch = require('../index.js')

const testSuite = suite('jsonDeepMergePatch')

const target = {
  firstLevelString: 'string',
  firstLevelNumber: 1,
  firstLevelBoolean: true,
  firstLevelDate: new Date(),
  firstLevelNull: null,
  firstLevelObject: {},
  firstLevelArray: [1],
  firstLevelNestedObject: {
    secondLevelObject: {},
    secondLevelNumber: 2,
    secondLevelNull: null,
    secondLevelNestedObject: {
      thirdLevelObject: {},
      thirdLevelNumber: 3,
      thirdLevelArray: [1, 2, 3],
      thirdLevelNestedObject: {
        fourthLevelObject: {},
        fourthLevelNumber: 4
      }
    }
  },
  firstLevelAnotherNestedObject: {
    secondLevelObject: {},
    secondLevelNumber: 2,
    secondLevelNestedObject: {
      thirdLevelObject: {},
      thirdLevelNumber: 3,
      thirdLevelArray: [1, 2, 3],
      thirdLevelNestedObject: {
        fourthLevelObject: {},
        fourthLevelNumber: 4
      }
    }
  }
}

testSuite('should be a function', () => {
  assert.type(jsonDeepMergePatch, 'function')
})

testSuite('should be RFC 7396 compliant without mutating target', () => {
  const target = {
    title: 'Goodbye!',
    author: {
      givenName: 'John',
      familyName: 'Doe'
    },
    tags: ['example', 'sample'],
    content: 'This will be unchanged'
  }

  const patch = {
    title: 'Hello!',
    phoneNumber: '+01-123-456-7890',
    author: {
      familyName: null
    },
    tags: ['example']
  }

  const expectedResult = {
    title: 'Hello!',
    author: {
      givenName: 'John'
    },
    tags: ['example'],
    content: 'This will be unchanged',
    phoneNumber: '+01-123-456-7890'
  }

  const result = jsonDeepMergePatch(target, patch)

  assert.equal(result, expectedResult)
  assert.equal(target, {
    title: 'Goodbye!',
    author: {
      givenName: 'John',
      familyName: 'Doe'
    },
    tags: ['example', 'sample'],
    content: 'This will be unchanged'
  })
})

testSuite('should patch the target without mutating it', () => {
  const date = new Date()
  date.setDate(date.getDate() - 1)

  const patch = {
    firstLevelArray: null,
    firstLevelDate: date,
    firstLevelNumber: 2,
    firstLevelNewString: 'new string',
    firstLevelNestedObject: {
      secondLevelString: 'string',
      secondLevelNestedObject: null
    }
  }

  const result = jsonDeepMergePatch(target, patch)

  assert.type(result.firstLevelArray, 'undefined')
  assert.equal(target.firstLevelArray, [1])

  assert.is(result.firstLevelNumber, 2)
  assert.is(target.firstLevelNumber, 1)

  assert.is(result.firstLevelNewString, patch.firstLevelNewString)
  assert.type(target.firstLevelNewString, 'undefined')

  assert.is(
    result.firstLevelNestedObject.secondLevelString,
    patch.firstLevelNestedObject.secondLevelString
  )
  assert.type(target.firstLevelNestedObject.secondLevelString, 'undefined')

  assert.type(
    result.firstLevelNestedObject.secondLevelNestedObject,
    'undefined'
  )
  assert.type(target.firstLevelNestedObject.secondLevelNestedObject, 'object')

  assert.is(result.firstLevelDate < target.firstLevelDate, true)
  assert.is.not(result.firstLevelDate, patch.firstLevelDate)
  assert.equal(result.firstLevelDate, patch.firstLevelDate)

  patch.firstLevelDate.setDate(date.getDate() + 2)

  assert.is(result.firstLevelDate < target.firstLevelDate, true)
  assert.not.equal(result.firstLevelDate, patch.firstLevelDate)
})

testSuite(
  'should patch a third level property in target without mutating it',
  () => {
    const patch = {
      firstLevelNestedObject: {
        secondLevelNestedObject: {
          thirdLevelNumber: 33
        }
      }
    }

    const result = jsonDeepMergePatch(target, patch)

    assert.is(
      result.firstLevelNestedObject.secondLevelNestedObject.thirdLevelNumber,
      patch.firstLevelNestedObject.secondLevelNestedObject.thirdLevelNumber
    )
    assert.is(
      target.firstLevelNestedObject.secondLevelNestedObject.thirdLevelNumber,
      3
    )
  }
)

testSuite('should go deep to depth = 1 without mutating target', () => {
  const patch = {
    firstLevelNestedObject: {
      secondLevelNestedObject: {
        thirdLevelNumber: 33,
        thirdLevelDate: new Date()
      }
    },
    firstLevelAnotherNestedObject: {
      secondLevelNestedObject: null
    }
  }

  const result = jsonDeepMergePatch(target, patch, { depth: 1 })

  assert.is(
    result.firstLevelNestedObject.secondLevelNestedObject.thirdLevelNumber,
    patch.firstLevelNestedObject.secondLevelNestedObject.thirdLevelNumber
  )
  assert.is(
    target.firstLevelNestedObject.secondLevelNestedObject.thirdLevelNumber,
    3
  )
  assert.type(result.firstLevelNestedObject.secondLevelNumber, 'undefined')
  assert.type(result.firstLevelNestedObject.secondLevelObject, 'undefined')
  assert.is(result.firstLevelNumber, 1)
  assert.is(
    result.firstLevelAnotherNestedObject.secondLevelNestedObject,
    patch.firstLevelAnotherNestedObject.secondLevelNestedObject
  )
})

testSuite('should go deep to depth = 2 without mutating target', () => {
  const patch = {
    firstLevelNestedObject: {
      secondLevelNestedObject: {
        thirdLevelNestedObject: {
          fourthLevelNumber: 44
        }
      }
    },
    firstLevelAnotherNestedObject: {
      secondLevelNestedObject: null
    }
  }

  const result = jsonDeepMergePatch(target, patch, { depth: 2 })

  assert.is(
    result.firstLevelNestedObject.secondLevelNestedObject.thirdLevelNestedObject
      .fourthLevelNumber,
    patch.firstLevelNestedObject.secondLevelNestedObject.thirdLevelNestedObject
      .fourthLevelNumber
  )
  assert.is(result.firstLevelNestedObject.secondLevelNumber, 2)
  assert.type(
    result.firstLevelNestedObject.secondLevelNestedObject.thirdLevelNumber,
    'undefined'
  )
  assert.type(
    result.firstLevelNestedObject.secondLevelNestedObject.thirdLevelObject,
    'undefined'
  )
  assert.type(
    result.firstLevelAnotherNestedObject.secondLevelNestedObject,
    'undefined'
  )
})

testSuite(
  'should go deep to last level (depth = 0, default) without mutating target',
  () => {
    const patch = {
      firstLevelNestedObject: {
        secondLevelNestedObject: {
          thirdLevelNestedObject: {
            fourthLevelNumber: 44
          }
        }
      },
      firstLevelAnotherNestedObject: {
        secondLevelNestedObject: null
      }
    }

    const result = jsonDeepMergePatch(target, patch)

    assert.is(
      result.firstLevelNestedObject.secondLevelNestedObject
        .thirdLevelNestedObject.fourthLevelNumber,
      patch.firstLevelNestedObject.secondLevelNestedObject
        .thirdLevelNestedObject.fourthLevelNumber
    )
    assert.is(
      result.firstLevelNestedObject.secondLevelNestedObject.thirdLevelNumber,
      3
    )
    assert.not.type(
      result.firstLevelNestedObject.secondLevelNestedObject.thirdLevelObject,
      'undefined'
    )
    assert.type(
      result.firstLevelAnotherNestedObject.secondLevelNestedObject,
      'undefined'
    )
  }
)

testSuite('should keep nulls without mutating target', () => {
  const patch = {
    firstLevelNumber: null,
    firstLevelAnotherNestedObject: {
      secondLevelNestedObject: null
    }
  }

  const result = jsonDeepMergePatch(target, patch, { keepNulls: true })

  assert.is(target.firstLevelNumber, 1)
  assert.is(result.firstLevelNumber, null)
  assert.type(
    target.firstLevelAnotherNestedObject.secondLevelNestedObject,
    'object'
  )
  assert.is(result.firstLevelAnotherNestedObject.secondLevelNestedObject, null)
})

testSuite('should avoid merging invalid props', () => {
  const invalidProp = '__proto__'
  const patch = {
    firstLevelAnotherNestedObject: {
      [invalidProp]: {
        injectProp: 'data'
      }
    }
  }

  const result = jsonDeepMergePatch(target, patch)

  assert.type(
    result.firstLevelAnotherNestedObject[invalidProp].injectProp,
    'undefined'
  )
  assert.type(
    target.firstLevelAnotherNestedObject[invalidProp].injectProp,
    'undefined'
  )
})

testSuite('should replace array with object without mutating target', () => {
  const patch = {
    firstLevelArray: { 2: true }
  }

  const result = jsonDeepMergePatch(target, patch)

  assert.equal(result.firstLevelArray, patch.firstLevelArray)
  assert.equal(target.firstLevelArray, [1])
})

testSuite('should not mutate result and target after mutating patch', () => {
  const patch = {
    firstLevelNestedObject: {
      secondLevelNestedObject: {
        thirdLevelNumber: 33
      }
    }
  }

  const result = jsonDeepMergePatch(target, patch)

  assert.equal(
    result.firstLevelNestedObject.secondLevelNestedObject.thirdLevelNumber,
    patch.firstLevelNestedObject.secondLevelNestedObject.thirdLevelNumber
  )
  assert.equal(
    target.firstLevelNestedObject.secondLevelNestedObject.thirdLevelNumber,
    3
  )

  patch.firstLevelNestedObject.secondLevelNestedObject.thirdLevelNumber = 333

  assert.is(
    patch.firstLevelNestedObject.secondLevelNestedObject.thirdLevelNumber,
    333
  )
  assert.is(
    result.firstLevelNestedObject.secondLevelNestedObject.thirdLevelNumber,
    33
  )
  assert.is(
    target.firstLevelNestedObject.secondLevelNestedObject.thirdLevelNumber,
    3
  )
})

testSuite('should throw if depth is not a whole number or null', () => {
  const patch = {
    firstLevelNestedObject: {
      secondLevelNestedObject: {
        thirdLevelNumber: 33
      }
    }
  }

  assert.throws(
    () => jsonDeepMergePatch(target, patch, { depth: -1 }),
    'Merge level must be a whole number or null.'
  )

  assert.throws(
    () => jsonDeepMergePatch(target, patch, { depth: 'one' }),
    'Merge level must be a whole number or null.'
  )
})

testSuite(
  'should not mutate result and target after mutating patch (array items)',
  () => {
    const patch = {
      firstLevelNestedObject: {
        secondLevelArray: [{ isMutable: false }]
      }
    }

    const result = jsonDeepMergePatch(target, patch)

    assert.is(
      result.firstLevelNestedObject.secondLevelArray[0].isMutable,
      false
    )
    assert.type(target.firstLevelNestedObject.secondLevelArray, 'undefined')

    patch.firstLevelNestedObject.secondLevelArray[0].isMutable = true

    assert.is(
      result.firstLevelNestedObject.secondLevelArray[0].isMutable,
      false
    )
    assert.type(target.firstLevelNestedObject.secondLevelArray, 'undefined')
  }
)

testSuite(
  'should avoid merging invalid props that are deeper than the specified depth without mutating target',
  () => {
    const invalidProp = '__proto__'
    const patch = {
      firstLevelNestedObject: {
        secondLevelNestedObject: {
          [invalidProp]: {
            injectProp: 'data'
          }
        }
      }
    }

    const result = jsonDeepMergePatch(target, patch, { depth: 1 })

    assert.type(
      result.firstLevelNestedObject.secondLevelNestedObject[invalidProp]
        .injectProp,
      'undefined'
    )
    assert.type(
      target.firstLevelNestedObject.secondLevelNestedObject[invalidProp]
        .injectProp,
      'undefined'
    )
  }
)

testSuite(
  'should avoid merging invalid props that are deeper than the specified depth without mutating target',
  () => {
    const invalidProp = '__proto__'
    const patch = {
      firstLevelNestedObject: {
        secondLevelNestedObject: {
          [invalidProp]: {
            injectProp: 'data'
          },
          thirdLevelArray: [3],
          thirdLevelNumber: 3
        },
        secondLevelArray: [2],
        secondLevelNumber: 22
      },
      firstLevelArray: [1],
      firstLevelNumber: 1
    }

    const result = jsonDeepMergePatch(target, patch, { depth: 1 })

    assert.type(
      result.firstLevelNestedObject.secondLevelNestedObject[invalidProp]
        .injectProp,
      'undefined'
    )
    assert.type(
      target.firstLevelNestedObject.secondLevelNestedObject[invalidProp]
        .injectProp,
      'undefined'
    )
  }
)

testSuite('should not mutate result and patch after mutating target', () => {
  const patch = {
    firstLevelNestedObject: {
      secondLevelNestedObject: {
        thirdLevelNumber: 33
      }
    }
  }

  const result = jsonDeepMergePatch(target, patch)

  assert.is(
    result.firstLevelNestedObject.secondLevelNestedObject.thirdLevelNumber,
    patch.firstLevelNestedObject.secondLevelNestedObject.thirdLevelNumber
  )
  assert.is(
    target.firstLevelNestedObject.secondLevelNestedObject.thirdLevelNumber,
    3
  )

  assert.is(
    target.firstLevelNestedObject.secondLevelNestedObject.thirdLevelNumber,
    3
  )

  target.firstLevelNestedObject.secondLevelNestedObject.thirdLevelNumber = 333

  assert.is(
    patch.firstLevelNestedObject.secondLevelNestedObject.thirdLevelNumber,
    33
  )
  assert.is(
    result.firstLevelNestedObject.secondLevelNestedObject.thirdLevelNumber,
    33
  )
  assert.is(
    target.firstLevelNestedObject.secondLevelNestedObject.thirdLevelNumber,
    333
  )

  target.firstLevelNestedObject.secondLevelNestedObject.thirdLevelNumber = 3
})

testSuite(
  `should not mutate result and patch after mutating target's unpatched props`,
  () => {
    const patch = {
      firstLevelNestedObject: {
        secondLevelNestedObject: {
          thirdLevelNumber: 33
        }
      }
    }

    const result = jsonDeepMergePatch(target, patch, {
      cloneUnpatchedProps: true
    })

    assert.is(
      result.firstLevelNestedObject.secondLevelNestedObject.thirdLevelNumber,
      patch.firstLevelNestedObject.secondLevelNestedObject.thirdLevelNumber
    )
    assert.is(
      target.firstLevelNestedObject.secondLevelNestedObject.thirdLevelNumber,
      3
    )

    assert.is(
      target.firstLevelAnotherNestedObject.secondLevelNestedObject
        .thirdLevelNumber,
      3
    )

    target.firstLevelAnotherNestedObject.secondLevelNestedObject.thirdLevelNumber = 333

    assert.type(patch.firstLevelAnotherNestedObject, 'undefined')
    assert.is(
      result.firstLevelAnotherNestedObject.secondLevelNestedObject
        .thirdLevelNumber,
      3
    )
    assert.is(
      target.firstLevelAnotherNestedObject.secondLevelNestedObject
        .thirdLevelNumber,
      333
    )

    target.firstLevelAnotherNestedObject.secondLevelNestedObject.thirdLevelNumber = 3
  }
)

testSuite.run()
