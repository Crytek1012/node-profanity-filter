# Node Profanity Filter

A Node.js profanity filter with support for exact matching, obfuscated word detection, and customizable replacement.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Author](#author)

## Installation

You can install the `node-profanity-filter` package using npm:

```bash
npm install node-profanity-filter
```

## Usage

```javascript
import { Filter } from 'node-profanity-filter';

const filter = new Filter({
    wordBoundaries: true,
    normalize: true,
    strict: false,
    replaceWith: '',
    words: ['badword']
});

// true
console.log(filter.isProfane('badword'));

// false
console.log(filter.isProfane('goodword'));

// true
console.log(filter.isProfane('b@dw0rd', {normalize: true}));

// result: {text: "I like your .", matches: string[]}
console.log(filter.replace('I like your badword.'));

// result: {text: "I like your cat.", matches: string[]}
console.log(filter.replace('I like your badword.', 'cat'));
```

## Options

| Option            | Type       | Default | Description                                                  |
|-------------------|------------|---------|--------------------------------------------------------------|
| `wordBoundaries`     | boolean    | false   | Match only whole words instead of substrings             |
| `normalize`          | boolean    | true    | Normalize common character obfuscations before matching        |
| `replaceWith`        | string     | ''      | String to replace detected profane words with                   |
| `words`              | string[]   | [ ]      | List of words to include in the filter                 |

## Author

Created by [Crytek1012](https://github.com/Crytek1012).

## License

This project is licensed under the [MIT License](LICENSE).