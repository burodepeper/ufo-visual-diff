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
npm install
```
