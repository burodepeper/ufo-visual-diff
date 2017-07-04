class UFOGlif {
  constructor(xml, ufo) {
    this.raw = xml
    this.ufo = ufo

    const parser = new DOMParser()
    this.xml = parser.parseFromString(xml, 'text/xml').childNodes[0]
    this.data = this.parseXML(this.xml)

    this.data.advance.height = this.ufo.getUnitsPerEm()
    this.ratio = this.data.advance.width / this.data.advance.height
    // console.log(this)
  }

  parseXML(xml) {
    let data = {}

    // Element with optional attributes
    if (xml.nodeType === 1 && xml.attributes.length > 0) {
      for (let i = 0; i < xml.attributes.length; i++) {
        const attribute = xml.attributes.item(i)
        data[attribute.nodeName] = attribute.nodeValue
      }
      // Text node; ignore them if they are nothing but whitespace
    } else if (xml.nodeType === 3) {
      const value = xml.nodeValue.trim()
      data = value.length ? value : false
    }

    // Parse children
    if (xml.hasChildNodes()) {
      for (let i = 0; i < xml.childNodes.length; i++) {
        const node = xml.childNodes.item(i)
        const name = node.nodeName
        const child = this.parseXML(node)
        if (child) {
          if (data[name] === undefined) {
            data[name] = child
          } else if (data[name] instanceof Array) {
            data[name].push(child)
          } else {
            data[name] = [data[name]]
            data[name].push(child)
          }
        }
      }
    }

    return data
  }

  getRatio() {
    return this.ratio
  }

  setContext(context) {
    this.context = context
  }

  getContext() {
    return this.context
  }

  setColor(color) {
    this.color = color
  }

  getColor() {
    return this.color
  }

  setHeight(height) {
    this.height = height
    this.scale = this.height / this.data.advance.height
  }

  getHeight() {
    return this.height
  }

  getWidth() {
    return this.height * this.ratio
  }

  getScale() {
    return this.scale
  }

  getYOffset() {
    return this.ufo.getDescender() * this.getScale()
  }

  draw(left) {
    const context = this.getContext()
    const color = this.getColor()
    const scale = this.getScale()
    const height = this.getHeight()
    const yOffset = this.getYOffset() + Math.random() * 10
    // const contours = this.getContours()

    context.globalCompositeOperation = 'multiply'
    context.fillStyle = color

    for (const contour of this.getContours()) {
      const points = contour.point

      // Duplicate the first point and move it to the back of the contour to close the path
      points.push(points[0])

      context.beginPath()
      let controlPoints = []
      for (let p = 0; p < points.length; p++) {
        const point = points[p]
        const x = left + point.x * scale
        const y = height - point.y * scale + yOffset
        point._x = x
        point._y = y

        if (p === 0) {
          context.moveTo(x, y)
        } else if (point.type === 'line') {
          context.lineTo(x, y)
          controlPoints = []
        } else if (point.type === 'curve') {
          if (controlPoints.length === 2) {
            const x1 = controlPoints[0]._x
            const y1 = controlPoints[0]._y
            const x2 = controlPoints[1]._x
            const y2 = controlPoints[1]._y
            context.bezierCurveTo(x1, y1, x2, y2, x, y)
          }
          controlPoints = []
        } else {
          controlPoints.push(point)
        }
      }
      context.fill()
    }
    context.closePath()
  }

  getContours() {
    return this.data.outline.contour
  }
}
