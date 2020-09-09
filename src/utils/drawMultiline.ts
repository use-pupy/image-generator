const WORD_SEPERATOR = ' '

export default function drawMultiline(ctx: CanvasRenderingContext2D, text: string) {
    const rectangle = {
        x: 80,
        y: 600,
        width: 860,
        height: ctx.canvas.height
    }

    const words = text.split(WORD_SEPERATOR)
    let lines = []

    ctx.font = '96px "Cabin" bold'
    ctx.fillStyle = 'white'

    for (let fontSize = 96; fontSize <= 96; fontSize++) {
        let lineHeight = 128

        // Start
        let x = rectangle.x
        let y = rectangle.y + fontSize // It's the bottom line of the letters
        lines = []
        let line = ""

        // Cycles on words
        for (let word of words) {
            // Add next word to line
            let linePlus = line + word + WORD_SEPERATOR
            // If added word exceeds rect width...
            if (ctx.measureText(linePlus).width > (rectangle.width)) {
                // ..."prints" (save) the line without last word
                lines.push({ text: line, x: x, y: y })
                // New line with ctx last word
                line = word + WORD_SEPERATOR
                y += lineHeight
            } else {
                // ...continues appending words
                line = linePlus
            }
        }

        // "Print" (save) last line
        lines.push({ text: line, x, y })

        // If bottom of rect is reached then breaks "fontSize" cycle
        if (y > rectangle.height)
            break

    }

    // lines.forEach((nLine) => ctx.fillText(nLine.text.trim(), nLine.x, nLine.y))

    const mergedLines = lines.map(l => l.text).join('\n')
    const measurement = ctx.measureText(mergedLines)

    ctx.fillText(mergedLines, rectangle.x, (rectangle.y + measurement.actualBoundingBoxAscent) - (measurement.actualBoundingBoxDescent / 2))
}
