# ufo-visual-diff

```js
// Given a html element <div id='visual-diff'>
new VisualDiff()
  .setContainer('visual-diff')
  .setGlyphs(['a', 'A_', 'ampersand', 'at'])
  .setHeight(240)
  .addSrc('https://raw.githubusercontent.com/source-foundry/Hack-dev/usability/source/ufo/Hack/Hack-Regular.ufo')
  .addSrc('https://raw.githubusercontent.com/chrissimpkins/Hack/master/source/ufo/vfb2ufo/Hack-Regular.ufo')
  .init()
```

## Development

Dependencies:
- Node.js

```sh
# Install packages
npm install

# Run all tasks and generate a /dist
grunt

# Watch for filesystem changes, and only run necessary tasks
grunt watch
```

## TODO

- [ ] Add a 'Loading...' progress indicator
- [ ] Add an interface to select sources and glyphs to load
