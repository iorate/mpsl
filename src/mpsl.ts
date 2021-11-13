import { PSL_RULES } from './psl-rules';

const SUFFIX = 1;
const EXCEPTION = 2;

export function get(domain: string): string | null {
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
    const rule = rules[label] || rules['*'];
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
  return labels
    .slice(0, suffixIndex + 2)
    .reverse()
    .join('.');
}
