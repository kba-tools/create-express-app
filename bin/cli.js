#!/usr/bin/env node

import chalk from 'chalk';
import { writeFileSync } from 'fs';
import inquirer from 'inquirer';
import mkdirp from 'mkdirp';

let app;

let pkg = {
    name: 'express-app',
    version: '0.0.0',
    private: true,
    scripts: {
        dev: 'node --watch ./src/bin/server.js',
        start: 'node ./src/bin/server.js'
    },
    dependencies: {
        "chalk": "^5.2.0",
        "cookie-parser": "^1.4.6",
        "express": "^4.18.2",
        "http-errors": "^2.0.0",
        "morgan": "^1.10.0"
    },
    devDependencies: {
        "eslint": "^8.34.0",
        "prettier": "^2.8.4"
    },
    type: 'module'
};

function createAppName(appName) {
    return appName
        .replace(/[^A-Za-z0-9.-]+/g, '-')
        .replace(/^[-_.]+|-+$/g, '')
        .toLowerCase();
}
function sortObject(unordered) {
    return Object.keys(unordered).sort().reduce(
        (obj, key) => {
            obj[key] = unordered[key];
            return obj;
        },
        {}
    );
}

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
    app = createAppName(answers.app_name);
    await mkdirp(`./${app}`);
    pkg.name = app
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
    if (answers.language === 'TypeScript') {
        pkg.scripts.dev = 'tsx watch ./src/bin/server';
        pkg.scripts.start = 'tsx ./src/bin/server';
        pkg.devDependencies['@types/cookie-parser'] = '^1.4.3';
        pkg.devDependencies['@types/express'] = '^4.17.17';
        pkg.devDependencies['@types/http-errors'] = '^2.0.1';
        pkg.devDependencies['@types/morgan'] = '^1.9.4';
        pkg.devDependencies['@types/node'] = '^18.13.0';
        pkg.devDependencies['tsx'] = '^3.12.3';
        pkg.devDependencies['typescript'] = '^4.9.5';
    }
    pkg.devDependencies = sortObject(pkg.devDependencies);
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
    if (answers.template === 'EJS') {
        pkg.dependencies['ejs'] = '^3.1.8'
    } else if (answers.template === 'Handlebars') {
        pkg.dependencies['hbs'] = '^4.2.0'
    }
    pkg.dependencies = sortObject(pkg.dependencies);
}

await askName();
await askLanguage();
await askTemplate();
writeFileSync(`./${app}/package.json`, JSON.stringify(pkg, null, 2));
console.log(`${app} is created!!`);