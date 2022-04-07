# The Coercer

Turns objects/arrays full of strings of numbers and booleans into primitives.

## Installation

```
npm install --save coercer
```

## Usage

```javascript
var coercer = require('coercer')

coerce({
  'foo': 'true',
  'bar': '5',
  'baz': 'hello',
  'qux': {
    'quux': 'eight'
   },
   'corge': ['7', '93.2', 'false'],
   'grault': true,
   'garply': false
  })

// returns
{
  'foo': true,
  'bar': 5,
  'baz': 'hello',
  'qux': {
    'quux': 'eight'
  },
  'corge': [7, 93.2, false],
  'grault': true,
  'garply': false
}
```
