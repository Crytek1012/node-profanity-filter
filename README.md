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
    parseObfuscated : true,
    replaceWith: '',
    disableDefaultList: false,  // true to start with empty word list
    excludeWords: [
        'excluded-badword'
    ],
    includeWords: [
        'math'
    ]
});

// true
console.log(filter.isProfane('badword'));

// false
console.log(filter.isProfane('goodword'));

// true (due to parseObfuscated)
console.log(filter.isProfane('b@dw0rd'));

// false (due to excludeWords)
console.log(filter.isProfane('excluded-badword'));

// true (due to includeWords)
console.log(filter.isProfane('math'));

// result: I like your .
console.log(filter.sanitize('I like your badword.'));

// result: I like your cat.
console.log(filter.sanitize('I like your badword.', 'cat'));
```

## Options

| Option            | Type       | Default | Description                                                  |
|-------------------|------------|---------|--------------------------------------------------------------|
| `wordBoundaries`   | boolean    | false   | Match only whole words instead of substrings                 |
| `parseObfuscated`  | boolean    | true    | Normalize common character obfuscations before matching      |
| `replaceWith`      | string     | ''      | String to replace detected profane words with                |
| `disableDefaultList` | boolean  | false   | Disable the default profanity word list                       |
| `excludeWords`     | string[]   | []      | List of words to exclude from filtering                       |
| `includeWords`     | string[]   | []      | List of additional words to include in filtering             |

## Author

Created by [Crytek1012](https://github.com/Crytek1012).

## License

This project is licensed under the [MIT License](LICENSE).