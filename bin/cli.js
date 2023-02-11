#!/usr/bin/env node

import chalk from 'chalk';
import { writeFileSync } from 'fs';
import inquirer from 'inquirer';
import mkdirp from 'mkdirp';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const details = require('../package.json');

let app;

async function askName() {
    const answers = await inquirer.prompt({
        name: 'app_name',
        type: 'input',
        prefix: '🔹',
        message: 'Give a name for the app:',
        default() {
            return 'express-app';
        },
    });
    app = answers.app_name;
    await mkdirp(`./${app}`);
}

async function askLanguage() {
    const answers = await inquirer.prompt({
        name: 'language',
        type: 'list',
        prefix: '🔹',
        message: 'Choose a language:',
        choices: [
            'JavaScript',
            'TypeScript'
        ],
    });
    console.log(`You chose ${answers.language}.`);
    writeFileSync(`./${app}/package.json`, JSON.stringify(details, null, 2));
}

async function askTemplate() {
    const answers = await inquirer.prompt({
        name: 'template',
        type: 'list',
        prefix: '🔹',
        message: 'Choose a template engine:',
        choices: [
            'None',
            'EJS',
            'Handlebars'
        ],
    });
    console.log(`You chose ${answers.template}.`);
}

await askName();
await askLanguage();
await askTemplate();
console.log(`${app} is created!!`);