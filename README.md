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

Source files are in _/src_, and [Grunt](https://www.gruntjs.com) is used to compile these into a _/dist_ directory which can be statically published, or even run locally.

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

- [ ] Add an interface to select sources and glyphs to load
- [ ] Allow config via GET parameters
- [ ] Do not allow modifications after init() has been invoked
- [ ] Allow local .ufo files to be dropped on the screen to set a src
