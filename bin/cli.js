#!/usr/bin/env node

import { writeFileSync, copyFileSync } from 'fs';
import { execSync } from 'child_process';
import { mkdirpSync } from 'mkdirp';
import { rimrafSync } from 'rimraf'
import chalk from 'chalk';
import inquirer from 'inquirer';

let app;

let pkg = {
    name: 'express-app',
    version: '0.0.1',
    private: true,
    scripts: {
        "dev": "node --watch ./src/bin/server.js",
        "start": "node ./src/bin/server.js"
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

const createAppName = appName => {
    return appName
        .replace(/[^A-Za-z0-9.-]+/g, '-')
        .replace(/^[-_.]+|-+$/g, '')
        .toLowerCase();
}

const sortObject = unordered => {
    return Object.keys(unordered).sort().reduce(
        (obj, key) => {
            obj[key] = unordered[key];
            return obj;
        },
        {}
    );
}

const runCommand = command => {
    try {
        execSync(`${command}`, { 'stdio': 'inherit' });
    } catch (error) {
        console.log(chalk.red(`Failed to execute ${command}.`));
        process.exit(1);
    }
    // return true;
}

const askName = async () => {
    const answers = await inquirer.prompt({
        name: 'app_name',
        type: 'input',
        prefix: '📛',
        message: chalk.green('Give a name for the app:'),
        default() {
            return 'express-app';
        },
    });
    app = createAppName(answers.app_name);
    pkg.name = app
}

const askLanguage = async () => {
    const answers = await inquirer.prompt({
        name: 'language',
        type: 'list',
        prefix: '🎲',
        message: chalk.green('Choose a language:'),
        choices: [
            ' JavaScript',
            ' TypeScript'
        ],
    });
    if (answers.language === ' TypeScript') {
        return true;
    } else {
        return false;
    };
}

const askTemplate = async () => {
    const answers = await inquirer.prompt({
        name: 'template',
        type: 'list',
        prefix: '🔖',
        message: chalk.green('Choose a template engine:'),
        choices: [
            ' None',
            ' EJS',
            ' Handlebars'
        ],
    });
    if (answers.template === 'EJS') {
        pkg.dependencies['ejs'] = '^3.1.8'
    } else if (answers.template === 'Handlebars') {
        pkg.dependencies['hbs'] = '^4.2.0'
    }
    pkg.dependencies = sortObject(pkg.dependencies);
}

const createJS = () => {
    copyFileSync('./templates/js/app.js', `./${app}/src/app.js`);
    copyFileSync('./templates/js/server.js', `./${app}/src/bin/server.js`);
    copyFileSync('./templates/js/index.js', `./${app}/src/routes/index.js`);
    copyFileSync('./templates/js/users.js', `./${app}/src/routes/users.js`);
}

const createTS = () => {
    pkg.scripts["dev"] = "tsx watch ./src/bin/server";
    pkg.scripts["start"] = "node ./dist/bin/server.js";
    pkg.scripts["build"] = "rimraf dist && npx tsc";
    pkg.scripts["prestart"] = "npm run build";
    pkg.dependencies["rimraf"] = '^4.1.2';
    pkg.devDependencies["@types/cookie-parser"] = "^1.4.3";
    pkg.devDependencies['@types/express'] = '^4.17.17';
    pkg.devDependencies['@types/http-errors'] = '^2.0.1';
    pkg.devDependencies['@types/morgan'] = '^1.9.4';
    pkg.devDependencies['@types/node'] = '^18.13.0';
    pkg.devDependencies['tsx'] = '^3.12.3';
    pkg.devDependencies['typescript'] = '^4.9.5';
    pkg.devDependencies = sortObject(pkg.devDependencies);

    mkdirpSync(`./${app}/src/types`);
    copyFileSync('./templates/ts/tsconfig.json', `./${app}/tsconfig.json`);
    copyFileSync('./templates/ts/app.ts', `./${app}/src/app.ts`);
    copyFileSync('./templates/ts/server.ts', `./${app}/src/bin/server.ts`);
    copyFileSync('./templates/ts/index.ts', `./${app}/src/routes/index.ts`);
    copyFileSync('./templates/ts/users.ts', `./${app}/src/routes/users.ts`);
    copyFileSync('./templates/ts/types/error.ts', `./${app}/src/types/error.ts`);
}

await askName();
const isTypeScript = await askLanguage();
await askTemplate();
rimrafSync(`./${app}`);
mkdirpSync(`./${app}/src/bin`);
mkdirpSync(`./${app}/src/routes`);

if (isTypeScript) {
    createTS();
} else {
    createJS();
}

writeFileSync(`./${app}/package.json`, JSON.stringify(pkg, null, 2));

const installDeps = `cd ${app} && npm install`;

console.log();
console.log(chalk.greenBright(`⚡ Installing dependencies for ${app}...`));
runCommand(installDeps);

console.log();
console.log(chalk.greenBright('🥂 Congratulations! You are good to go.'));
console.log(chalk.greenBright('🏹 Type in the following command to start:'));
console.log();
console.log(chalk.cyan(`🎯 cd ${app} && npm run dev`));
console.log();