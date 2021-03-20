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

function prepareTarget(target) {
  if (!isObject(target) || isNullish(target) || isArray(target)) {
    target = {}
  } else if (isObject(target)) {
    target = Object.assign({}, target)
  }
  return target
}

function isPropNotOk(obj, prop) {
  return !hasOwnProp(obj, prop) || isInvalidProp(prop)
}

function processNull(target, name, value, keepNulls) {
  if (!keepNulls) {
    delete target[name]
  } else {
    target[name] = value
  }
}

function processPatchProps({
  patch,
  target,
  cloneUnpatchedProps,
  targetNames,
  keepNulls,
  depth
}) {
  for (const name in patch) {
    if (isPropNotOk(patch, name)) {
      continue
    }
    if (cloneUnpatchedProps) {
      targetNames.push(name)
    }
    const value = patch[name]

    if (value === null && hasOwnProp(target, name)) {
      processNull(target, name, value, keepNulls)
    } else if (depth > 1) {
      target[name] = _jsonDeepMergePatch(target[name], value, {
        depth: depth - 1,
        keepNulls,
        cloneUnpatchedProps
      })
    } else if (depth === 0 || !isObject(value)) {
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

function processTargetProps({
  target,
  cloneUnpatchedProps,
  targetNames,
  keepNulls,
  depth
}) {
  for (const name in target) {
    if (targetNames.indexOf(name) !== -1 || isPropNotOk(target, name)) {
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

function _jsonDeepMergePatch(
  target,
  patch,
  { depth, keepNulls, cloneUnpatchedProps }
) {
  if (patch instanceof Date) {
    return new Date(patch)
  }
  if (!isObject(patch)) {
    return patch
  }
  if (isArray(patch)) {
    return cloneArray(patch)
  }
  target = prepareTarget(target)

  const targetNames = []

  processPatchProps({
    patch,
    target,
    cloneUnpatchedProps,
    targetNames,
    keepNulls,
    depth
  })

  if (cloneUnpatchedProps) {
    processTargetProps({
      target,
      cloneUnpatchedProps,
      targetNames,
      keepNulls,
      depth
    })
  }

  return target
}

module.exports = _jsonDeepMergePatch
