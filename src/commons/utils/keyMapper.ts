export const toCamel = (s: string) => {
  return s.replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });
}

export const toUnderscore = (key: string) => {
  return key.replace(/([A-Z])/g, "_$1").toLowerCase();
}

const isArray = function (a: any) {
  return Array.isArray(a);
};

const isObject = function (o: any) {
  return o === Object(o) && !isArray(o) && typeof o !== 'function';
}

export const keysToCamel = function <T>(o: T): T {
  if (isObject(o)) {
    const n: any = {};

    Object.keys(o as any)
      .forEach((k) => {
        n[toCamel(k)] = keysToCamel((o as any)[k]);
      });

    return n;
  } else if (isArray(o)) {
    return o.map((i: any) => {
      return keysToCamel(i);
    }) as T;
  }

  return o;
}

export const keysToUnderscore = function <T>(o: T): T {
  if (isObject(o)) {
    const n: any = {};

    Object.keys(o as any)
      .forEach((k) => {
        n[toUnderscore(k)] = keysToUnderscore((o as any)[k]);
      });

    return n;
  } else if (isArray(o)) {
    return o.map((i: any) => {
      return keysToUnderscore(i);
    }) as T;
  }

  return o;
}