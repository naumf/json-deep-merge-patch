'use strict'

const {
  cloneObject,
  cloneArray,
  hasOwnProp,
  isArray,
  isNullish,
  isObject,
  isInvalidProp
} = require('./utils')

function _jsonDeepMergePatch(
  target,
  patch,
  { depth, keepNulls, cloneUnpatchedProps }
) {
  if (patch instanceof Date) return new Date(patch)
  if (!isObject(patch)) return patch
  if (isArray(patch)) return cloneArray(patch)
  if (!isObject(target) || isNullish(target) || isArray(target)) {
    target = {}
  } else if (isObject(target)) {
    target = Object.assign({}, target)
  }

  let targetNames
  if (cloneUnpatchedProps) targetNames = []

  for (const name in patch) {
    if (cloneUnpatchedProps) targetNames.push(name)
    if (!hasOwnProp(patch, name) || isInvalidProp(name)) continue
    const value = patch[name]

    if (value === null && hasOwnProp(target, name)) {
      if (!keepNulls) {
        delete target[name]
      } else {
        target[name] = value
      }
    } else if (depth > 1) {
      target[name] = _jsonDeepMergePatch(target[name], value, {
        depth: depth - 1,
        keepNulls,
        cloneUnpatchedProps
      })
    } else if (depth === 0) {
      target[name] = _jsonDeepMergePatch(target[name], value, {
        depth,
        keepNulls,
        cloneUnpatchedProps
      })
    } else if (!isObject(value)) {
      target[name] = _jsonDeepMergePatch(target[name], value, {
        depth,
        keepNulls,
        cloneUnpatchedProps
      })
    } else if (isArray(value)) {
      target[name] = cloneArray(value)
    } else {
      target[name] = cloneObject(value)
    }
  }

  if (cloneUnpatchedProps) {
    for (const name in target) {
      if (
        targetNames.indexOf(name) !== -1 ||
        !hasOwnProp(target, name) ||
        isInvalidProp(name)
      ) {
        continue
      }
      const value = target[name]
      if (!isObject(value)) {
        target[name] = _jsonDeepMergePatch(target[name], value, {
          depth,
          keepNulls,
          cloneUnpatchedProps
        })
      } else if (isArray(value)) {
        target[name] = cloneArray(value)
      } else {
        target[name] = cloneObject(value)
      }
    }
  }

  return target
}

module.exports = _jsonDeepMergePatch
