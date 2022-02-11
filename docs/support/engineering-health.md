# Engineering health

[![CircleCI branch](https://img.shields.io/circleci/project/github/react-forked/dnd/master.svg)](https://circleci.com/gh/react-forked/dnd/tree/master)

#### TypeScript

This codebase is using [`TypeScript`](https://www.typescriptlang.org/). Changes will not be merged without correct typing. If you are not sure about a particular use case let TypeScript break the build and it can be discussed in the pull request.

The [`TypeScript`](https://www.typescriptlang.org/docs/handbook/intro.html) documentation is great. Have a look at it.

## Tested

[![Tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://www.npmjs.com/package/@react-forked/dnd) [![Tested with cypress](https://img.shields.io/badge/tested%20with-cypress-brightgreen.svg?style=flat)](https://www.cypress.io/)

This code base employs a number of different testing strategies including unit, integration, browser and performance tests. Testing various aspects of the system helps to promote its quality and stability.

While code coverage is [not a guarantee of code health](https://stackoverflow.com/a/90021/1374236), it is a good indicator. This code base currently sits at **~94% coverage**.

## Linting

- [`eslint`](https://eslint.org/)
- [`stylelint`](https://github.com/stylelint/stylelint)
- [`prettier`](https://github.com/prettier/prettier) - well, not strictly a linter, but close enough

## Performance

[![CircleCI branch](https://img.shields.io/badge/speed-blazing%20%F0%9F%94%A5-brightgreen.svg?style=flat)](https://circleci.com/gh/react-forked/dnd/tree/master)

This codebase is designed to be **extremely performant** - it is part of its DNA. It is designed to perform the smallest amount of updates possible. You can have a read about performance work done for `@react-forked/dnd` here:

- [Rethinking drag and drop](https://medium.com/@alexandereardon/rethinking-drag-and-drop-d9f5770b4e6b)
- [Dragging React performance forward](https://medium.com/@alexandereardon/dragging-react-performance-forward-688b30d40a33)
- [Grabbing the flame 🔥](https://medium.com/@alexandereardon/grabbing-the-flame-290c794fe852)

> More in [media](/docs/support/media.md)

## Size

[![minzip](https://img.shields.io/bundlephobia/minzip/@react-forked/dnd.svg)](https://www.npmjs.com/package/@react-forked/dnd)

Great care has been taken to keep the library as light as possible. There could be a smaller net cost if you where already using one of the underlying dependencies.

[← Back to documentation](/README.md#documentation-)
