const transform = keys =>
  string => string ? Object.keys(keys).reduce((cur, next) => cur.replace(keys[next], next), string) : string;

export const heDecode = transform({
  '&': /&amp;/g,
  '"': /&quot;/g,
  "'": /&#x27;/g,
  '<': /&lt;/g,
  '>': /&gt;/g,
  '`': /&#x60;/g,
});

export const heShallowEncode = transform({
  '&lt;': /</g,
  '&gt;': />/g,
});

export const heEncode = transform({
  '&amp;': /&/g,
  '&quot;': /"/g,
  '&#x27;': /'/g,
  '&lt;': /</g,
  '&gt;': />/g,
  '&#x60;': /`/g,
});
