export default (doc: Document): SVGElement =>
  doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
