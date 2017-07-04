class VisualDiff {
  constructor() {
    this.element = false
    this.glyphs = []
    this.ufos = []
    this.height = 96
    this.colors = ['#0055dd', '#ee1100', '#55dd00']
    this.colorIndex = 0
  }

  setContainer(id) {
    if (typeof id !== 'string') {
      throw 'VisualDiff.setContainer() {id} for container is expected to be a string'
    }
    const element = document.getElementById(id)
    if (!element) {
      throw `VisualDiff.setContainer() Element '#${id}' not found`
    }
    this.element = element
    return this
  }

  setGlyphs(glyphs) {
    if (!Array.isArray(glyphs)) {
      throw 'VisualDiff.setGlyphs() {glyphs} is expected to be an array of strings'
    }
    this.glyphs = []
    glyphs.forEach(glyph => {
      this.addGlyph(glyph)
    })
    return this
  }

  addGlyph(id) {
    if (typeof id !== 'string') {
      throw 'VisualDiff.addGlyph() {id} is expected to be a string'
    }
    this.glyphs.push(id)
    return this
  }

  getGlyphs() {
    return this.glyphs
  }

  setHeight(height) {
    if (!Number.isInteger(height)) {
      throw `VisualDiff.setHeight() Invalid value for height '${height}'`
    }
    this.height = height
    return this
  }

  getHeight() {
    return this.height
  }

  addSrc(src) {
    if (typeof src !== 'string') {
      throw 'VisualDiff.addSrc() {src} is expected to be a string'
    }
    const ufo = new UFO()
    const glyphs = this.getGlyphs()
    ufo.setSrc(src)
    ufo.setGlyphs(glyphs)
    this.ufos.push(ufo)
    return this
  }

  async init() {
    this.createCanvas()

    await this.initUfos()
    console.log('VisualDiff.init() All UFO data loaded')

    this.resizeCanvas()
    console.log('VisualDiff.init() Canvas resized to match first glyph')

    // TODO: instruct glyphs to draw themselves, and in what color
    this.draw()

    console.log(this)
  }

  async initUfos() {
    for (const ufo of this.ufos) {
      await ufo.init()
    }
  }

  draw() {
    const height = this.getHeight()
    const context = this.getContext()
    for (const ufo of this.ufos) {
      ufo.setContext(context)
      ufo.setHeight(height)
      const color = this.getNextColor()
      ufo.setColor(color)
      ufo.draw()
    }
  }

  getNextColor() {
    const color = this.colors[this.colorIndex]
    this.colorIndex = (this.colorIndex + 1) % this.colors.length
    return color
  }

  getContext() {
    return this.context
  }

  createCanvas() {
    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')
    this.element.appendChild(this.canvas)
  }

  resizeCanvas() {
    const height = this.getHeight()
    const width = this.ufos[0].getWidthForHeight(height)
    this.canvas.setAttribute('width', width)
    this.canvas.setAttribute('height', height)
  }
}
