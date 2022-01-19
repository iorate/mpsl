import punycode from 'punycode/';
import { PSL_RULES } from './psl-rules';

export type ParseResult = {
  tld: string;
  sld: string;
  domain: string;
  subdomain: string | null;
};

const SUFFIX = 1;
const EXCEPTION = 2;

export function parse(domain: string): ParseResult | null {
  if (typeof domain !== 'string') {
    return null;
  }
  const labels = domain.toLowerCase().split('.').reverse();
  if (labels.includes('')) {
    return null;
  }
  let suffixIndex: number | null = null;

  let rules = PSL_RULES;
  for (let i = 0; i < labels.length; ++i) {
    const label = labels[i];
    const rule = rules[punycode.toASCII(label)] || rules['*'];
    if (!rule) {
      break;
    } else if (rule === SUFFIX) {
      suffixIndex = i;
      break;
    } else if (rule === EXCEPTION) {
      // If the prevailing rule is a exception rule, modify it by removing the leftmost label.
      suffixIndex = i - 1;
      break;
    } else {
      if (!rule['']) {
        suffixIndex = i;
      }
      rules = rule;
    }
  }
  // If no rules match, the prevailing rule is "*".
  if (suffixIndex == null) {
    suffixIndex = 0;
  }

  if (suffixIndex + 2 > labels.length) {
    return null;
  }
  return {
    tld: labels
      .slice(0, suffixIndex + 1)
      .reverse()
      .join('.'),
    sld: labels[suffixIndex + 1],
    domain: labels
      .slice(0, suffixIndex + 2)
      .reverse()
      .join('.'),
    subdomain:
      labels
        .slice(suffixIndex + 2)
        .reverse()
        .join('.') || null,
  };
}

export function get(domain: string): string | null {
  return parse(domain)?.domain ?? null;
}

export function isValid(domain: string): boolean {
  return parse(domain) != null;
}
