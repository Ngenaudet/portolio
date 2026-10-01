// Run from the repository root: swift scripts/generate-social-preview.swift
import AppKit
import CoreText

let width = 1200, height = 630
let bitmap = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: width, pixelsHigh: height, bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
let context = NSGraphicsContext(bitmapImageRep: bitmap)!
NSGraphicsContext.saveGraphicsState()
NSGraphicsContext.current = context
let cg = context.cgContext
cg.translateBy(x: 0, y: CGFloat(height))
cg.scaleBy(x: 1, y: -1)
func color(_ r: CGFloat, _ g: CGFloat, _ b: CGFloat) -> NSColor {
    NSColor(red: r/255, green: g/255, blue: b/255, alpha: 1)
}
let ink = color(14,30,43), paper = color(243,245,242), lime = color(220,245,122)
paper.setFill()
NSBezierPath(rect: NSRect(x: 0,y: 0,width: width,height: height)).fill()
ink.setFill()
NSBezierPath(roundedRect: NSRect(x: 24,y: 24,width: 1152,height: 582),xRadius: 30,yRadius: 30).fill()
for name in ["instrument-sans-400-normal", "instrument-sans-600-normal", "instrument-serif-400-italic"] {
    let url = URL(fileURLWithPath: "assets/fonts/\(name).ttf")
    CTFontManagerRegisterFontsForURL(url as CFURL, .process, nil)
}
func text(_ value: String, x: CGFloat, y: CGFloat, size: CGFloat, font: String, color: NSColor) {
    let attributes: [NSAttributedString.Key: Any] = [.font: NSFont(name: font, size: size) ?? NSFont.systemFont(ofSize: size), .foregroundColor: color]
    let string = NSAttributedString(string: value, attributes: attributes)
    cg.saveGState()
    cg.translateBy(x: x, y: y + string.size().height)
    cg.scaleBy(x: 1, y: -1)
    string.draw(at: .zero)
    cg.restoreGState()
}
// Geometry from assets/crest.svg, in the site's light palette.
cg.saveGState()
cg.translateBy(x: 950, y: 84)
let crest = NSBezierPath()
crest.move(to: NSPoint(x:14,y:120))
for (x,y) in [(69,42),(104,87),(126,62),(165,120)] { crest.line(to: NSPoint(x:x,y:y)) }
crest.lineWidth = 15
crest.lineCapStyle = .round
crest.lineJoinStyle = .round
paper.setStroke(); crest.stroke()
lime.setFill(); NSBezierPath(ovalIn: NSRect(x:122,y:11,width:26,height:26)).fill()
cg.restoreGState()
text("WEB, DESIGN & TRANSMISSION", x: 80, y: 78, size: 20, font: "InstrumentSans-SemiBold", color: lime)
text("Nicolas", x: 76, y: 140, size: 76, font: "InstrumentSans-SemiBold", color: paper)
text("Genaudet", x: 76, y: 215, size: 108, font: "InstrumentSerif-Italic", color: paper)
text("Développeur WordPress · Designer UX/UI", x: 80, y: 380, size: 30, font: "InstrumentSans-Regular", color: paper)
text("Consultant SEO · Formateur", x: 80, y: 425, size: 30, font: "InstrumentSans-Regular", color: paper)
lime.setFill(); NSBezierPath(rect: NSRect(x:80,y:508,width:1040,height:1)).fill()
text("Créer. Construire. Avancer.", x: 80, y: 537, size: 22, font: "InstrumentSans-Regular", color: lime)
text("nicolas-genaudet.fr", x: 888, y: 537, size: 22, font: "InstrumentSans-Regular", color: paper)
NSGraphicsContext.restoreGraphicsState()
try bitmap.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: "assets/social-preview.png"))
