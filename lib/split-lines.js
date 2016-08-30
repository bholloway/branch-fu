function splitLines(text) {
  return String(text || '')
    .split('\n')
    .map(v => v.trim())
    .filter(Boolean);
}

module.exports = splitLines;