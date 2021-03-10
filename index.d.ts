interface JsonDeepMergePatchOptions {
  depth?: number;
  keepNulls?: boolean;
  cloneUnpatchedProps?: boolean
}

declare function jsonDeepMergePatch(target: object, patch: object, opts?: JsonDeepMergePatchOptions): object;

export = jsonDeepMergePatch;
