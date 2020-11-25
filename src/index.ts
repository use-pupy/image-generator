import {createServer} from 'http'
import { join } from 'path'
import { parse } from 'url'
import { createCanvas, loadImage, registerFont } from 'canvas'
import drawMultiline from "./utils/drawMultiline";

require('dotenv').config()

// If the process is started without a generation secret available in the
// environment variables, we are exiting the process immediately, since
// unauthorized use of this endpoint can be harmful for the server the
// script is being hosted on
if (!process.env.GENERATION_SECRET)
    process.exit(126)

const fixturesPath = join(__dirname, '..', 'src', 'fixtures')

// We are relying on a simple `http` since we don't need the urges of a
// fully blown server like `express` is such.
const server = createServer((req, res) => {
    // We need to parse the URL since we are only using the `createServer`
    // method from node's `http` module. Hence we are using the url parser
    // from node to get the correct query parameters.
    const { query, ...url } = parse(req.url, true)

    // Implementing some sort of routing. We are implementing a custom route
    // named "/ping" which can be accessed by the Pingdom service. We are
    // using this one to ensure, that the server is online and available.
    //
    // This endpoint simply returns "pong" as plain text, to ensure the server
    // is online.
    if (url.pathname === '/ping') {
        res.writeHead(401, { 'Content-Type': 'text/plain' });
        res.write('Please specify `secret`.');
        res.end();

        return
    }

    // This snippet is also important for the security measurements of the
    // server.
    // Without a secret, we are opening the generation endpoint up to the
    // public, which can increase memory usage of the server (and also massive
    // costs for the owner of the server)
    if (!query.secret || query.secret !== process.env.GENERATION_SECRET) {
        res.writeHead(401, { 'Content-Type': 'text/plain' });
        res.write('Please specify `secret`.');
        res.end();

        return
    }

    // Cancel the process/server call, when the user, or caller hasn't
    // specified any content. `color` does not need to be verified, since
    // we are setting a default for it.
    if (!query.content) {
        res.writeHead(422, { 'Content-Type': 'text/plain' });
        res.write('Please specify `content` and `color`.');
        res.end();

        return
    }

    const { content, locale = 'de', color = '#fe7155' } = query
    const canvas = createCanvas(1200, 1200)
    const ctx = canvas.getContext('2d')

    // Add the color the user/client specified through the query parameters.
    // We are falling back to our primary color of the application, so the
    // user is able to just leave the color out in the query params.
    ctx.moveTo(0, 0)
    ctx.fillStyle = color as string
    ctx.fillRect(0, 0, 1200, 1200)

    // Be sure to set the quality to the best we get.
    ctx.quality = 'nearest'
    // ctx.quality = 'bilinear'

    // Register the correct font, so we are sure, that the image looks good.
    registerFont(join(fixturesPath, 'fonts', 'Cabin-Bold.ttf'), { family: 'Cabin' })

    // And afterwards set the font for the whole context. So, when we are
    // adding another text anywhere, we are also using the right font and
    // not any ugly font.
    ctx.font = '96px "Cabin"'

    // Load the template image. We are not putting everything ourself on the
    // canvas, instead, we are using a transparent image with the things that
    // won't change through the system.
    loadImage(join(fixturesPath, `template-${locale}.png`)).then((image) => {
        ctx.drawImage(image, 0, 0, 1200, 1200)

        // Use the multiline utility, because we rely on longer texts than
        // just a single liner, and node-canvas does not have a possibility
        // to have multiline texts (except through `\n`).
        //
        // However, we cannot dynamically set the `\n`'s on the backend,
        // hence we need to calculate on our side.
        drawMultiline(ctx, content as string)

        // When we are using an API-driven system, we are returning the base64,
        // so that the system can adopt the base64 easily and return it itself.
        if (query.format === 'base64') {
            const canvasUrl = canvas.toDataURL()

            // Of course, do not forget to use json response type.
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.write('{ "url": "' + canvasUrl + '" }')
            res.end();

            return
        }

        // Write the image to the response, we need to set some options, so the
        // quality is not corrupt.
        const canvasBuffer = canvas.toBuffer('image/jpeg', { quality: 1, progressive: true })

        res.writeHead(200, {'Content-Type': 'image/jpeg'});
        res.write(canvasBuffer);
        res.end();
    })
})

server.listen(process.env.PORT || 3000, () => {
    console.log('Server up on port', process.env.PORT || 3000)
})