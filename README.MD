# json-deep-merge-patch

Merges and patches a target object. By default the returning object is a shallow merge of unpatched and deep merge of patched target's properties. There is an option to clone unpatched target properties as well.

## Features:
  - No dependencies
  - Only patched properties are cloned by default
  - Option: clone unpatched properties
  - Option: depth based merging
  - Option: keep nulls
  - [RFC 7396](https://tools.ietf.org/html/rfc7396) compliant<sup>*</sup>

<sup>*</sup> As described above, the returning object is a clone, so target object is left intact. If you need [RFC 7396](https://tools.ietf.org/html/rfc7396) compliance and mutating the target object, use [json-merge-patch](https://github.com/pierreinglebert/json-merge-patch).

## Benchmarks
- Clone this repository.
- Install the dev dependencies.

npm:
```sh
npm i
```
yarn:
```sh
yarn
```

- Open `./bench.js` in your favourite code editor and replace the `target` and `patch` values with the desired ones.
- Run the benchmark.

npm:
```sh
npm run bench
```
yarn:
```sh
yarn bench
```

## Install

npm:
```sh
npm i json-deep-merge-patch --save
```
yarn:
```sh
yarn add json-deep-merge-patch
```

## Usage

```js
const jsonDeepMergePatch = require('json-deep-merge-patch')

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

const result = jsonDeepMergePatch(target, patch)

/*
result = {
  title: 'Hello!',
  author: {
    givenName: 'John'
  },
  tags: ['example'],
  content: 'This will be unchanged',
  phoneNumber: '+01-123-456-7890'
}
*/
```

## API

```ts
jsonDeepMergePatch(target: Object, patch: Object, opts?: Options)
```

### Options

- `depth` (`null|Number`, **default**: `null`)
  -  Specifies the number of times to recurse while merging the object, if set to `null` (default) it will recurse up to the maximum call stack.
- `keepNulls` (`Boolean`, **default**: `false`)
  - As the name suggests properties with null values in patch set matching target properties to null, instead of deleting them.
- `cloneUnpatchedProps` (`Boolean`, **default**: `false`)
  - If set to `false` (default), the returning object is a shallow merge of unpatched and deep merge of patched target's properties.
  - If set to `true`, the returning object is a deep merge of unpatched and patched target's properties.

## License
[MIT](./LICENSE)
