/* eslint-disable */
import { heShallowEncode } from './html-entities';

function decode(str) {
  try {
    // In node this can possibly throw an error - URIError: Uncaught error: URI malformed
    return decodeURIComponent(str);
  } catch (e) {
    return '';
  }
}

export function splitQuery(search) {
  if (!search) return {};
  const queries = search.split('?')[1];

  return queries ? queries.split('&').reduce((prev, curr) => {
        const [key, value] = curr.split('=');
        const decoded = decode(value);

        return {
          ...prev,
          [key]: heShallowEncode(decoded.replace(/\+/g, ' ')),
        };
      }, {}) : {};
}

export function joinQuery(query) {
  return `?${Object.keys(query)
    .map(value => `${encodeURIComponent(value)}=${encodeURIComponent(query[value])}`)
    .join('&')}`;
}

export function removeQuery(url) {
  return url && url.includes('?') ? url.split('?')[0] : url;
}

const DOMAIN_REGEX = /([\w|.]+)\//;
export function replaceDomain(url, replacement) {
  const matches = url && url.match(DOMAIN_REGEX);

  return matches && matches.length > 1 ? url.replace(matches[1], replacement) : url;
}
