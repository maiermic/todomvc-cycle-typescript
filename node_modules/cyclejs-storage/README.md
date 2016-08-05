# cyclejs-storage

A [Cycle.js](http://cycle.js.org) [Driver](http://cycle.js.org/drivers.html) for using
[localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) and
[sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
 in the browser.

(Inspired by @cylce/storage)

## For breaking changes see here

[Changelog](CHANGELOG.md)

## Installation

```
npm install --save cyclejs-storage
```

## Usage

Basics:

```js
import Cycle from '@cycle/xstream-run';
import { makeStorageDriver } from 'cyclejs-storage';

function main(sources) {
  // ...
}

const drivers = {
  storage: makeStorageDriver()
}

Cycle.run(main, drivers);
```

Simple and normal use case:

```js
function main({ DOM, storage }) {
   const storageRequest$ = DOM.select('input')
    .events('keypress')
    .map(function(ev) {
      return {
        key: 'inputText',
        value: ev.target.value,
        target: 'local'
      };
    });

  return {
    DOM: storage.local
    .getItem('inputText')
    .startWith('')
    .map((text) =>
      h('input', {
        type: 'text',
        value: text
      })
    ),
    storage: storageRequest$
  };
}
```

Seperated usage:

```js
import { makeSessionStorageDriver } from 'cyclejs-storage';
// ...

function main({ DOM, sessionStorage }) {
    const item$ = sessionStorage.getItem('item');

    const vdom$ = item$.filter(i => !!i).map(i => h2('hello ' + i));

    return {
        DOM: vdom$,
        sessionStorage: xs.of({ key: 'item', value: 'world' })
    };
}

const drivers = {
    DOM: makeDOMDriver(),
    sessionStorage: makeSessionStorageDriver()
};

Cycle.run(main, drivers);
```
