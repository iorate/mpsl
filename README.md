# mpsl

A relatively small and fast port of [the Public Suffix List](https://publicsuffix.org/) to JavaScript/TypeScript.

## Usage

`mpsl.get(domain)` returns the registrable part of `domain`.

```typescript
import * as mpsl from 'mpsl';

console.log(mpsl.get('www.test.ac.jp')); // test.ac.jp
```

`mpsl.get` does not throw an exception and returns `null` on invalid input.

## Author

[iorate](https://github.com/iorate)

## License

[MIT](LICENSE.txt)

## Acknowledgements

The Public Suffix List was initiated by Mozilla and is maintained by the community. I appreciate their great work.

The Public Suffix List is available at [the official website](https://publicsuffix.org) or [the GitHub repository](https://github.com/publicsuffix/list). It is distributed under [MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/).