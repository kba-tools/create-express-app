# Create Express App

A minimalist boilerplate generator for quickly setting up a new [Express](https://expressjs.com/) application — with your choice of language and an optional template engine.

## Features

- Supports **JavaScript** and **TypeScript**
- Optional support for **EJS** or **Handlebars**
- Automatically installs dependencies using your preferred package manager (`npm`, `pnpm`, or `yarn`)
- Generates a clean, minimal project structure

## Quick Start

Run the following command and follow the interactive prompts:

```bash
npx @kba-tools/create-express-app
```

You’ll be asked to choose:

- Language: JavaScript or TypeScript
- Template engine: None, EJS or Handlebars
- Package manager: npm, pnpm, or yarn

Once confirmed, the app scaffold will be generated and dependencies installed automatically.

```bash
cd my-express-app
npm start
```

## Example Structure

```
my-express-app/
├── src/
│   ├── routes/
│   ├── views/
│   └── app.js
├── package.json
└── README.md
```

## Why Use This?

Skip repetitive Express setup steps and start coding immediately.
**Create Express App** provides a clean, ready-to-use foundation for any Express project.

## License

Distributed under the **MIT License**.
See [`LICENSE`](./LICENSE.md) for details.
