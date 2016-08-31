const dedupeXbyY = (x, y) => array => {
  const lookupXbyY = array
    .reduce((reduced, value) => {
      const existingX = value[x];
      const existingY = value[y];

      const key = existingY.toLowerCase();
      const allocatedX = reduced[key];

      const isOverwrite = !!existingX && (!allocatedX || (allocatedX.length < existingX.length));

      return Object.assign(reduced, {[key]: isOverwrite ? existingX : allocatedX});
    }, {});

  return array.map(value => {
    const key = value[y].toLowerCase();
    const dedupedX = lookupXbyY[key];
    return Object.assign({}, value, {[x]: dedupedX})
  });
};

module.exports = dedupeXbyY;