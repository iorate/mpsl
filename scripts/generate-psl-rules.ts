import { promises as fs } from 'fs';
import axios from 'axios';
import punycode from 'punycode';

type Rules = { readonly [label: string]: 1 | 2 | Rules };
type MutableRules = { [label: string]: 1 | 2 | MutableRules };

const SUFFIX = 1;
const EXCEPTION = 2;

function generatePSLRules(psl: string): Rules {
  const pslRules: MutableRules = {};

  outer: for (let line of psl.split('\n')) {
    line = line.split(/\s/, 1)[0];
    if (!line || line.startsWith('//')) {
      continue;
    }
    const exception = line.startsWith('!');
    if (exception) {
      line = line.slice(1);
    }
    line = punycode.toASCII(line.toLowerCase());
    const labels = line.split('.').reverse();

    let rules = pslRules;
    for (const label of labels.slice(0, -1)) {
      const rule = rules[label];
      if (!rule) {
        rules = rules[label] = { '': 1 };
      } else if (rule === SUFFIX) {
        rules = rules[label] = {};
      } else if (rule === EXCEPTION) {
        continue outer;
      } else {
        rules = rule;
      }
    }
    const lastLabel = labels[labels.length - 1];
    if (!rules[lastLabel]) {
      delete rules[''];
      rules[lastLabel] = exception ? EXCEPTION : SUFFIX;
    } else if (rules[lastLabel] === SUFFIX || rules[lastLabel] === EXCEPTION) {
      continue;
    } else {
      delete rules[''];
    }
  }

  for (const tld of Object.keys(pslRules)) {
    if (pslRules[tld] === SUFFIX) {
      delete pslRules[tld];
    }
  }
  return pslRules;
}

async function main(): Promise<void> {
  const psl = (await axios.get('https://publicsuffix.org/list/public_suffix_list.dat')).data;
  const pslRules = generatePSLRules(psl);
  const pslRulesTS = `export type Rules = { readonly [label: string]: 1 | 2 | Rules };

// prettier-ignore
export const PSL_RULES = JSON.parse(${JSON.stringify(JSON.stringify(pslRules))}) as Rules;
`;
  await fs.writeFile('src/psl-rules.ts', pslRulesTS);
}

void main();
