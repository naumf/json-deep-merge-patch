'use strict'

function hasOwnProp(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

function isArray(value) {
  return Array.isArray(value)
}

function isInvalidProp(property) {
  return ['__proto__', 'constructor', 'prototype'].indexOf(property) !== -1
}

function isNullish(value) {
  return [null, undefined].indexOf(value) !== -1
}

function isObject(operand) {
  return typeof operand === 'object'
}

function cloneObject(obj) {
  if (obj instanceof Date) return new Date(obj)
  const cloned = {}
  for (const name in obj) {
    if (!hasOwnProp(obj, name) || isInvalidProp(name)) continue
    const value = obj[name]
    if (isNullish(value)) {
      cloned[name] = value
    } else if (isArray(value)) {
      cloned[name] = cloneArray(value)
    } else if (isObject(value)) {
      if (value instanceof Date) {
        cloned[name] = new Date(value)
      } else {
        cloned[name] = Object.assign({}, cloneObject(value))
      }
    } else {
      cloned[name] = value
    }
  }
  return cloned
}

function cloneArray(arr) {
  const cloned = []
  for (const item of arr) {
    if (!isObject(item)) {
      cloned.push(item)
    } else if (isArray(item)) {
      cloned.push(cloneArray(item))
    } else {
      cloned.push(cloneObject(item))
    }
  }
  return cloned
}

module.exports = {
  cloneArray,
  cloneObject,
  hasOwnProp,
  isArray,
  isInvalidProp,
  isNullish,
  isObject
}
