'use strict';

export default <T extends {[key: string]: unknown}>(x: string, y: string) => (array: ReadonlyArray<T>) => {
  const lookupXbyY = array
    .map(v => Object.fromEntries(Object.entries(v).map(([k, v]) => [k, String(v)])))
    .reduce<{[key: string]: string}>((reduced, value) => {
      const existingX = String(value[x]);
      const existingY = String(value[y]);

      const key: string = existingY.toLowerCase();
      const allocatedX = reduced[key];
      const isOverwrite = !!existingX && (!allocatedX || (allocatedX.length < existingX.length));

      return Object.assign(reduced, {[key]: isOverwrite ? existingX : allocatedX});
    }, {});

  return array.map(value => {
    const key = String(value[y]).toLowerCase();
    const dedupedX = lookupXbyY[key];
    return Object.assign({}, value, {[x]: dedupedX})
  });
};
