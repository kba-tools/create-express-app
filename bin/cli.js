#!/usr/bin/env node

import { writeFileSync, copyFileSync } from 'fs'
import { execSync } from 'child_process'
import { mkdirpSync } from 'mkdirp'
import { rimrafSync } from 'rimraf'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import chalk from 'chalk'
import inquirer from 'inquirer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const TEMPLATE_DIR = join(__dirname, '..', 'templates')

let pkg = {
  name: 'express-app',
  version: '0.0.1',
  private: true,
  scripts: {
    dev: 'nodemon ./src/bin/server.js',
    start: 'node ./src/bin/server.js',
  },
  dependencies: {
    chalk: '^5.3.0',
    'cookie-parser': '^1.4.6',
    express: '^4.19.2',
    morgan: '^1.10.0',
  },
  devDependencies: {
    eslint: '^9.8.0',
    prettier: '^3.3.3',
  },
  type: 'module',
}

const createAppName = (appName) => {
  return appName
    .replace(/[^A-Za-z0-9.-]+/g, '-')
    .replace(/^[-_.]+|-+$/g, '')
    .toLowerCase()
}

const sortObject = (unordered) => {
  return Object.keys(unordered)
    .sort()
    .reduce((obj, key) => {
      obj[key] = unordered[key]
      return obj
    }, {})
}

const runCommand = (command) => {
  try {
    execSync(`${command}`, { stdio: 'inherit' })
  } catch (error) {
    console.log(chalk.red(`❌ Failed to execute ${command}.`))
    process.exit(1)
  }
}

const askName = async () => {
  const answers = await inquirer.prompt({
    name: 'app_name',
    type: 'input',
    prefix: '◈ ',
    message: chalk.green('Give a name for the app: '),
    default() {
      return 'express-app'
    },
  })
  return createAppName(answers.app_name)
}

const askLanguage = async () => {
  const answers = await inquirer.prompt({
    name: 'language',
    type: 'list',
    prefix: '◈ ',
    message: chalk.green('Choose a language:'),
    choices: [' JavaScript', ' TypeScript'],
  })
  if (answers.language === ' TypeScript') {
    return 'ts'
  } else {
    return 'js'
  }
}

const askTemplate = async () => {
  const answers = await inquirer.prompt({
    name: 'template',
    type: 'list',
    prefix: '◈ ',
    message: chalk.green('Choose a template engine:'),
    choices: [' None', ' EJS', ' Handlebars'],
  })
  if (answers.template === ' EJS') {
    pkg.dependencies['ejs'] = '^3.1.10'
    return 'ejs'
  } else if (answers.template === ' Handlebars') {
    pkg.dependencies['hbs'] = '^4.2.0'
    return 'hbs'
  } else {
    return null
  }
}

const askManager = async () => {
  const answers = await inquirer.prompt({
    name: 'manager',
    type: 'list',
    prefix: '◈ ',
    message: chalk.green('Choose a package manager:'),
    choices: [' npm', ' pnpm', ' yarn'],
  })

  return answers.manager
}

const generateTemplate = (app, lang, temp) => {
  rimrafSync(`./${app}`)
  mkdirpSync(`./${app}/src/bin`)
  mkdirpSync(`./${app}/src/routes`)
  copyFileSync(
    `${TEMPLATE_DIR}/${lang}/server.${lang}`,
    `./${app}/src/bin/server.${lang}`
  )
  copyFileSync(
    `${TEMPLATE_DIR}/${lang}/users.${lang}`,
    `./${app}/src/routes/users.${lang}`
  )

  if (temp) {
    pkg.dependencies['http-errors'] = '^2.0.0'
    mkdirpSync(`./${app}/src/views`)
    mkdirpSync(`./${app}/public/styles`)
    copyFileSync(
      `${TEMPLATE_DIR}/views/public/style.css`,
      `./${app}/public/styles/style.css`
    )
    copyFileSync(
      `${TEMPLATE_DIR}/views/public/favicon.ico`,
      `./${app}/public/favicon.ico`
    )
    copyFileSync(
      `${TEMPLATE_DIR}/${lang}/app.${temp}.${lang}`,
      `./${app}/src/app.${lang}`
    )
    copyFileSync(
      `${TEMPLATE_DIR}/${lang}/index.render.${lang}`,
      `./${app}/src/routes/index.${lang}`
    )
    copyFileSync(
      `${TEMPLATE_DIR}/views/${temp}/index.${temp}`,
      `./${app}/src/views/index.${temp}`
    )
    copyFileSync(
      `${TEMPLATE_DIR}/views/${temp}/error.${temp}`,
      `./${app}/src/views/error.${temp}`
    )
  } else {
    copyFileSync(
      `${TEMPLATE_DIR}/${lang}/app.${lang}`,
      `./${app}/src/app.${lang}`
    )
    copyFileSync(
      `${TEMPLATE_DIR}/${lang}/index.${lang}`,
      `./${app}/src/routes/index.${lang}`
    )
  }

  if (lang === 'ts') {
    pkg.scripts['dev'] = 'tsx watch ./src/bin/server'
    pkg.scripts['start'] = 'node ./dist/bin/server.js'
    pkg.scripts['build'] = 'rimraf dist && npx tsc'
    pkg.scripts['postbuild'] = `copyfiles -u 1 src/views/*.${temp} dist`
    pkg.scripts['prestart'] = 'npm run build'
    pkg.devDependencies['rimraf'] = '^5.0.5'
    pkg.devDependencies['copyfiles'] = '^2.4.1'
    pkg.devDependencies['@types/cookie-parser'] = '^1.4.7'
    pkg.devDependencies['@types/express'] = '^4.17.21'
    pkg.devDependencies['@types/http-errors'] = '^2.0.4'
    pkg.devDependencies['@types/morgan'] = '^1.9.9'
    pkg.devDependencies['@types/node'] = '^22.1.0'
    pkg.devDependencies['tsx'] = '^4.16.5'
    pkg.devDependencies['typescript'] = '^5.5.4'

    mkdirpSync(`./${app}/src/types`)
    copyFileSync(`${TEMPLATE_DIR}/ts/tsconfig.json`, `./${app}/tsconfig.json`)
    copyFileSync(
      `${TEMPLATE_DIR}/ts/types/error.ts`,
      `./${app}/src/types/error.ts`
    )
  } else {
    pkg.devDependencies['nodemon'] = '^3.1.4'
  }

  if (temp === 'hbs') {
    copyFileSync(
      `${TEMPLATE_DIR}/views/hbs/layout.hbs`,
      `./${app}/src/views/layout.hbs`
    )
  }

  pkg.name = app
  pkg.dependencies = sortObject(pkg.dependencies)
  pkg.devDependencies = sortObject(pkg.devDependencies)

  writeFileSync(`./${app}/package.json`, JSON.stringify(pkg, null, 2))
  copyFileSync(`${TEMPLATE_DIR}/gitignore`, `./${app}/.gitignore`)
}

const app = await askName()
const lang = await askLanguage()
const temp = await askTemplate()
const pm = await askManager()

generateTemplate(app, lang, temp)

const installDeps = `cd ${app} && ${pm.slice(1)} install`

console.log()
console.log(chalk.magenta(`⚡ Installing dependencies for ${app}...`))
runCommand(installDeps)

console.log()
console.log('◈  ' + chalk.magenta('Congratulations! You are good to go.'))
console.log('◈  ' + chalk.magenta('Type in the following command to start:'))
console.log()
console.log(
  chalk.cyan(
    `⚓ cd ${app} && ${pm.slice(1)} ${pm === ' npm' ? 'run dev' : 'dev'}`
  )
)
console.log()
