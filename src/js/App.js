class App {
  constructor() {
    this.createDiffInterface()
    this.createDiffElement()
    this.initDiff()
  }

  createDiffInterface() {
    this.interfaceContainer = document.createElement('div')
    this.interfaceContainer.classList.add('interface')
    document.body.appendChild(this.interfaceContainer)

    this.glyphsInput = document.createElement('input')
    this.glyphsInput.setAttribute('type', 'text')
    this.glyphsInput.setAttribute('placeholder', 'Glyphs (comma separated)')
    this.glyphsInput.setAttribute('value', 'O_, zero, eight, B_')
    // this.glyphsInput.setAttribute('value', 'zero')
    this.interfaceContainer.appendChild(this.glyphsInput)

    this.heightSelect = document.createElement('select')
    const heights = [32, 64, 96, 128, 192, 256, 512, 1024]
    heights.forEach(height => {
      const option = document.createElement('option')
      option.setAttribute('value', height)
      option.textContent = height + 'px'
      if (height === 512) {
        option.selected = true
      }
      this.heightSelect.appendChild(option)
    })
    this.interfaceContainer.appendChild(this.heightSelect)

    this.diffButton = document.createElement('button')
    this.diffButton.textContent = 'Diff'
    this.interfaceContainer.appendChild(this.diffButton)
    this.diffButton.addEventListener('click', event => {
      event.preventDefault()
      this.makeDiff()
    })
  }

  createDiffElement() {
    this.diffContainer = document.createElement('div')
    this.diffContainer.setAttribute('id', 'visual-diff')
    document.body.appendChild(this.diffContainer)
  }

  initDiff() {
    this.diff = new VisualDiff().setContainer('visual-diff')
  }

  makeDiff() {
    const glyphs = this.glyphsInput.value.split(',').map(glyph => glyph.trim())
    const height = parseInt(this.heightSelect.value, 10)

    this.diff
      .setGlyphs(glyphs)
      .setHeight(height)
      // .addSrc(
      //   'https://raw.githubusercontent.com/source-foundry/Hack-dev/usability/source/ufo/Hack/Hack-Regular.ufo'
      // )
      // .addSrc(
      //   'https://raw.githubusercontent.com/chrissimpkins/Hack/master/source/ufo/Hack-Regular.ufo'
      // )
      // .addSrc(
      //   'https://raw.githubusercontent.com/chrissimpkins/Hack/master/source/deprecated/ufo/vfb2ufo/Hack-Regular.ufo'
      // )
      .addSrc(
        'https://raw.githubusercontent.com/burodepeper/Hack/master/source/ufo/Hack-Regular-PS.ufo'
      )
      .addSrc(
        'https://raw.githubusercontent.com/burodepeper/Hack/master/source/ufo/Hack-Regular-TT.ufo'
      )
      .init()
  }
}
