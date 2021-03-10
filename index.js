'use strict'

const _jsonDeepMergePatch = require('./src/jsonDeepMergePatch')

const defaultOpts = {
  depth: null,
  keepNulls: false,
  cloneUnpatchedProps: false
}

function jsonDeepMergePatch(target, patch, opts) {
  opts = Object.assign({}, defaultOpts, opts)
  if (opts.depth === null) opts.depth = 0
  if (typeof opts.depth !== 'number' || opts.depth < 0) {
    throw new Error('Merge level must be a whole number or null.')
  }
  return _jsonDeepMergePatch(target, patch, opts)
}

module.exports = jsonDeepMergePatch
