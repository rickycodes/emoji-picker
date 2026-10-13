# Emoji Picker

[![Live demo](https://img.shields.io/badge/demo-live-ec4899)](https://rickycodes.github.io/emoji-picker/)
[![Latest release](https://img.shields.io/github/v/release/rickycodes/emoji-picker)](https://github.com/rickycodes/emoji-picker/releases/latest)
[![Tests](https://github.com/rickycodes/emoji-picker/actions/workflows/test.yml/badge.svg)](https://github.com/rickycodes/emoji-picker/actions/workflows/test.yml)
[![Coverage](https://codecov.io/gh/rickycodes/emoji-picker/branch/main/graph/badge.svg)](https://app.codecov.io/gh/rickycodes/emoji-picker/tree/main)

A lightweight, accessible emoji picker built with vanilla JavaScript. Type a shortcode such as `:dog` to find matching emoji, then choose one with the mouse or keyboard.

![Demo: typing shortcodes and selecting cat and dog emoji](emoji-picker-demo.gif)

**[Try the live demo](https://rickycodes.github.io/emoji-picker/)**

Search by shortcode, navigate suggestions with **Left/Right**, and insert emoji at the text caret. The picker uses native browser modules and needs no build step.

## Use

The project uses native browser ES modules and does not need a build step. Serve this directory over HTTP and open `index.html` (browsers generally block module imports from `file://`).

```js
import picker from "./src/index.js";
import fetchJSON from "./src/fetchJSON.js";

fetchJSON("./src/emoji.json").then((emoji) => picker(".input", emoji));
```

Press **Down** to activate the first suggestion, then use **Left/Right** to move across the suggestions. Press **Enter** to insert the active emoji; **Up** clears the active suggestion, and **Escape** dismisses the list. The picker also works with mouse clicks. Matching uses the shortcode immediately before the text caret, so it can be used in the middle of a sentence.

## Accessibility

The input is exposed as a **combobox** connected to a **listbox** of suggestions. Each suggestion has an accessible name based on its shortcode, and the active suggestion is announced while focus stays in the input. The keyboard controls above let users browse and select suggestions without a mouse.

`picker(selector, emojiData)` returns the input, suggestion list, and a `destroy()` method for removing the picker and its accessibility attributes.

## Tests

Run the behavior tests locally with:

```sh
npm install
npm test
```

GitHub Actions runs `npm test` on every push and pull request. The command also writes a local coverage report to `coverage/` and uploads it to Codecov in CI.

## Formatting

Format the project with Prettier, or check formatting without changing files:

```sh
npm run format
npm run format:check
```

## License

Copyright (c) 2016 Ricky Miller (@rickycodes). Released under the [MIT license](https://tldrlegal.com/license/mit-license).
