# Emoji Picker

A small vanilla JavaScript emoji picker. Type a shortcode such as `:dog` to see matching emoji, then choose one with the mouse or keyboard.

## Use

The project uses native browser ES modules and does not need a build step. Serve this directory over HTTP and open `index.html` (browsers generally block module imports from `file://`).

```js
import picker from './src/index.js'
import fetchJSON from './src/fetchJSON.js'

fetchJSON('./src/emoji.json').then(emoji => picker('.input', emoji))
```

Press **Down** to activate the first suggestion, then use **Left/Right** to move across the suggestions. Press **Enter** to insert the active emoji; **Up** clears the active suggestion, and **Escape** dismisses the list. The picker also works with mouse clicks. Matching uses the shortcode immediately before the text caret, so it can be used in the middle of a sentence.

## Accessibility

The input is exposed as a **combobox** connected to a **listbox** of suggestions. Each suggestion has an accessible name based on its shortcode, and the active suggestion is announced while focus stays in the input. The keyboard controls above let users browse and select suggestions without a mouse.

`picker(selector, emojiData)` returns the input, suggestion list, and a `destroy()` method for removing the picker and its accessibility attributes.

## License

Copyright (c) 2016 Ricky Miller (@rickycodes). Released under the [MIT license](https://tldrlegal.com/license/mit-license).
