class UFO {
  constructor() {
    this.src = ''
    this.glyphs = {}
    this.context = false
    this.color = false
  }

  setSrc(src) {
    this.src = src
  }

  setGlyphs(glyphs) {
    glyphs.forEach(glyph => {
      this.glyphs[glyph] = false
    })
  }

  setGlyph(id, glyph) {
    this.glyphs[id] = glyph
  }

  getGlyphs() {
    return this.glyphs
  }

  getGlyph(id) {
    return this.glyphs[id]
  }

  async init() {
    await this.loadFontInfo()
    await this.loadGlyphs()
  }

  async loadFontInfo() {
    const url = this.getURL('/fontinfo.plist')
    return fetch(url)
      .then(this.doFetchStatus)
      .then(response => response.text())
      .then(text => this.parsePList(text))
  }

  doFetchStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(new Error(response.statusText))
    }
  }

  parsePList(data) {
    this.fontInfo = PlistParser.parse(data)
  }

  getUnitsPerEm() {
    return this.fontInfo.unitsPerEm
  }

  getDescender() {
    return this.fontInfo.descender
  }

  async loadGlyphs() {
    for (const id in this.glyphs) {
      const url = this.getURL(`/glyphs/${id}.glif`)
      await fetch(url)
        .then(this.doFetchStatus)
        .then(response => response.text())
        .then(data => {
          const glyph = new UFOGlif(data, this)
          this.setGlyph(id, glyph)
        })
    }
  }

  getContext() {
    return this.context
  }

  setContext(context) {
    this.context = context
  }

  getColor() {
    return this.color
  }

  setColor(color) {
    this.color = color
  }

  getURL(path = '') {
    return this.src + path
  }

  getWidthForHeight(height) {
    let ratio = 0
    for (const id in this.getGlyphs()) {
      const glyph = this.getGlyph(id)
      ratio += glyph.getRatio()
    }
    return height * ratio
  }

  setHeight(height) {
    this.height = height
  }

  getHeight() {
    return this.height
  }

  draw() {
    const context = this.getContext()
    const color = this.getColor()
    const height = this.getHeight()
    const glyphs = this.getGlyphs()
    let left = 0
    for (const id in glyphs) {
      const glyph = this.getGlyph(id)
      glyph.setContext(context)
      glyph.setColor(color)
      glyph.setHeight(height)
      glyph.draw(left)
      left += glyph.getWidth()
    }
  }
}
