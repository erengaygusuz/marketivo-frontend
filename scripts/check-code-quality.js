#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Code quality check script
 * This script runs Prettier and ESLint checks and exits with error code if any issues are found
 */

import { execSync } from 'child_process';
import { exit } from 'process';

const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m',
    bold: '\x1b[1m',
};

function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

function runCommand(command, description) {
    try {
        log(`\n${colors.blue}${colors.bold}Running ${description}...${colors.reset}`);
        const output = execSync(command, {
            encoding: 'utf8',
            stdio: 'pipe',
        });

        if (output.trim()) {
            console.log(output);
        }

        log(`${colors.green}✓ ${description} passed${colors.reset}`);
        return true;
    } catch (error) {
        log(`${colors.red}✗ ${description} failed${colors.reset}`);
        if (error.stdout) {
            console.log(error.stdout);
        }
        if (error.stderr) {
            console.error(error.stderr);
        }
        return false;
    }
}

function main() {
    log(`${colors.bold}${colors.blue}🔍 Running code quality checks...${colors.reset}`);

    let allPassed = true;

    // Run Prettier check
    const prettierPassed = runCommand('npm run format:check', 'Prettier formatting check');

    if (!prettierPassed) {
        allPassed = false;
        log(`${colors.yellow}💡 Tip: Run 'npm run format' to fix formatting issues${colors.reset}`);
    }

    // Run ESLint check
    const eslintPassed = runCommand('npm run lint:check', 'ESLint code quality check');

    if (!eslintPassed) {
        allPassed = false;
        log(`${colors.yellow}💡 Tip: Run 'npm run lint' to fix auto-fixable issues${colors.reset}`);
    }

    if (allPassed) {
        log(`\n${colors.green}${colors.bold}✅ All code quality checks passed!${colors.reset}`);
        log(`${colors.green}🚀 Ready to start the application${colors.reset}`);
        exit(0);
    } else {
        log(`\n${colors.red}${colors.bold}❌ Code quality checks failed!${colors.reset}`);
        log(`${colors.red}🛑 Please fix the issues before starting the application${colors.reset}`);
        log(`${colors.yellow}Run 'npm run code:fix' to automatically fix most issues${colors.reset}`);
        exit(1);
    }
}

main();
