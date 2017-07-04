# ufo-visual-diff

```js
// Given a html element <div id='compare'>
new VisualDiff()
  .setContainer('visual-diff')
  .setGlyphs(['a', 'A_', 'ampersand', 'at'])
  .setSize({ width: 400, height: 400 })
  .addSrc('https://raw.githubusercontent.com/source-foundry/Hack-dev/usability/source/ufo/Hack/Hack-Regular.ufo')
  .addSrc('https://raw.githubusercontent.com/chrissimpkins/Hack/master/source/ufo/vfb2ufo/Hack-Regular.ufo')
  .init()
```

## Development

Requirements:
- Node.js

```sh
npm install
```
