class UFOGlif {
  constructor(xml, ufo) {
    this.UFO2 = '1'
    this.UFO3 = '2'
    this.raw = xml
    this.ufo = ufo

    const parser = new DOMParser()
    this.xml = parser.parseFromString(this.raw, 'text/xml')
    this.xml = this.xml.childNodes[0]
    this.data = this.parseXML(this.xml)

    this.data.advance.height = this.ufo.getUnitsPerEm()
    this.ratio = this.data.advance.width / this.data.advance.height
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

  getName() {
    return this.data.name
  }

  getFormat() {
    return this.data.format
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
    let yOffset = this.getYOffset()

    // NOTE: Temporary random offset to create an artificial difference
    yOffset += Math.random() * 10

    context.globalCompositeOperation = 'xor'
    context.fillStyle = color

    const contours = this.getContours()
    for (const contour of contours) {
      const points = contour.point
      /*
      Shift the points of the contour, so that the first point is _not_ of the
      type line, curve or qcurve. It is impossible to draw either of those
      without having a previous reference, or one or two controlpoints.
      */
      let typeDetected = false
      while (!typeDetected) {
        const point = points[0]
        typeDetected =
          point.type === 'line' ||
          point.type === 'curve' ||
          point.type === 'qcurve'
        points.push(points.shift())
      }

      /*
      We assume that we are only going to draw closed contours, so we duplicate
      the first few points until we've found a point to draw (type is line, curve or qcurve) and add them to the back of the contour to automatically
      close the shape.
      */
      let pointFound = false
      let i = 0
      while (!pointFound) {
        const point = points[i]
        points.push(point)
        pointFound =
          point.type === 'line' ||
          point.type === 'curve' ||
          point.type === 'qcurve'
        i++
      }
      // points.push(points[0])

      context.beginPath()
      let controlPoints = []
      for (let p = 0; p < points.length; p++) {
        const point = points[p]
        const x = left + point.x * scale
        const y = height - point.y * scale + yOffset
        point._x = x
        point._y = y

        if (p === 0 || point.type === 'move') {
          context.moveTo(x, y)
          controlPoints.push(point)
        } else if (point.type === 'line') {
          context.lineTo(x, y)
          controlPoints = []
        } else if (point.type === 'curve' || point.type === 'qcurve') {
          if (controlPoints.length === 2) {
            const x1 = controlPoints[0]._x
            const y1 = controlPoints[0]._y
            const x2 = controlPoints[1]._x
            const y2 = controlPoints[1]._y
            context.bezierCurveTo(x1, y1, x2, y2, x, y)
          } else if (controlPoints.length === 1) {
            const x1 = controlPoints[0]._x
            const y1 = controlPoints[0]._y
            context.quadraticCurveTo(x1, y1, x, y)
          } else if (controlPoints.length === 0) {
            context.lineTo(x, y)
          } else {
            if (this.getFormat() === this.UFO2) {
              console.warn(
                `UFOGlif[${this.getName()}].draw() Higher order bezier curves are not supported`
              )
            } else {
              console.warn(
                `UFOGlif[${this.getName()}].draw() Too many control points:`,
                controlPoints
              )
            }
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
    let contours = this.data.outline.contour
    // NOTE: an array is expected
    if (!Array.isArray(contours)) {
      contours = [contours]
    }
    return contours
  }
}
