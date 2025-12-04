const fs = require("fs");
const path = require("path");

/**
 * Replaces an environment variable in the .env file.
 * @param {string} filePath The path to the .env file.
 * @param {string} key The environment variable key.
 * @param {string} value The environment variable value.
 */
function replaceEnvVar(filePath, key, value) {
    const envPath = resolveEnvPath();
    const envContent = fs.readFileSync(envPath, "utf8");
    const lines = envContent.split("\n");
    const updatedLines = [];
    let found = false;

    for (const line of lines) {
        if (line.startsWith(`${key}=`)) {
            updatedLines.push(`${key}=${value}`);
            found = true;
            
        } else {
            updatedLines.push(line);
        }
    }

    if (!found) {
        updatedLines.push(`${key}=${value}`);
    }

    fs.writeFileSync(envPath, updatedLines.join("\n"), "utf8");
}

/**
 * @returns {string} The path to the .env file.
 */
function resolveEnvPath() {
    const envPath = process.env.INIT_CWD ? `${process.env.INIT_CWD}/.env` : ".env";
    return path.resolve(envPath);
}

module.exports = { replaceEnvVar, resolveEnvPath };
