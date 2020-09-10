## `@pupy/image-gen`

### Features

- :lock: Security through simple plain text environment variable secret
- :seedling: Ability to host on Heroku
- :memo: Multiline text on `node-canvas`
- :package: Simple server, without any unnecessary dependencies.
- :alembic: Coming soon: CLI for integration into your existing workflow

### Table of contents

- [Usage](#usage)
- [Motivation](#motivation)

### Usage

In order to use this – is long as the CLI is not there, yet – you are able to use this repository as template to customize and go from here.

You can use this by clicking [here](https://github.com/pupy-app/image-generator/generate).

### Motivation

For our app, we have a section called "Tips" where dog owners can get useful tips on a daily basis. Every day, every app user is presented a new set of 3 tips which (s)he can share with her friends if desired. Because the editoral effort is very big, when the editor needs to create a new image for each tip, we seeked for a solution to fit our needs in a super easy way.

Upon research we stumbled uppon `imgkit` because our API is also written in Ruby. We are hosting our servers/droplets on Heroku, which made it a little harder for us to deploy `wkhtmltopdf` (which `imgkit` is using behind the scenes). So we searched for a much easier solution for our problem. So, I had `canvas` in mind. With `node-canvas` being a pretty stable solution for "backend" `canvas` support, we had our solution ready. And then, in no time, we had our image generation service ready to deploy in an easy way through Heroku. With the help of `node-canvas`.
