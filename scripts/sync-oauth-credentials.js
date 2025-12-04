const { Core } = require("@adobe/aio-sdk");
const { replaceEnvVar } = require("./lib/env.js");

const logger = Core.Logger("scripts/sync-oauth-credentials", { level: process.env.LOG_LEVEL || "info" });

/**
 * Maps IMS context keys to OAuth environment variable keys.
 */
const keyMap = {
  client__id: "OAUTH_CLIENT_ID",
  client__secrets: "OAUTH_CLIENT_SECRET",
  technical__account__id: "OAUTH_TECHNICAL_ACCOUNT_ID",
  technical__account__email: "OAUTH_TECHNICAL_ACCOUNT_EMAIL",
  ims__org__id: "OAUTH_ORG_ID",
  private__key: "OAUTH_PRIVATE_KEY",
  private__key__id: "OAUTH_PRIVATE_KEY_ID",
  meta__scopes: "OAUTH_META_SCOPES",
  ims__host: "OAUTH_HOST",
  ims__context: "OAUTH_IMS_CONTEXT",
};

/**
 * Main function to sync OAuth credentials from IMS context environment variables.
 */
function main() {
  try {
    const envVars = process.env;
    const imsContextEnvVars = parseImsContextEnvVars(envVars);

    if (imsContextEnvVars.length === 0) {
      logger.info("No AIO_ims_contexts_* environment variables found");
      return;
    }

    logger.info(`Found ${imsContextEnvVars.length} IMS context environment variables`);

    imsContextEnvVars.forEach(({ credential, key, value }) => {
      const oauthKey = keyMap[key];
      if (!oauthKey) {
        logger.warn(`No mapping found for key: ${key}`);
        return;
      }

      if (key === "client__secrets") {
        value = JSON.parse(value)[0];
      }

      if (!envVars[oauthKey]) {
        replaceEnvVar(null, oauthKey, value);
        logger.info(`Added ${oauthKey} with value from AIO_ims_contexts_${credential}_${key}`);
      } else if (envVars[oauthKey] !== value) {
        replaceEnvVar(null, oauthKey, value);
        logger.info(`Replaced ${oauthKey} with value from AIO_ims_contexts_${credential}_${key}`);
      } else {
        logger.debug(`${oauthKey} is in sync with AIO_ims_contexts_${credential}_${key}`);
      }
    });

    logger.info("OAUTH env vars synced successfully");
  } catch (e) {
    logger.error("Failed to sync OAUTH env vars", e);
  }
}

/**
 * Parses the environment variables to find those that start with 'AIO_ims_contexts_'.
 * @param {object} envVars the environment variables object
 * @returns {Array} an array of objects containing the credential, key and value from the AIO_ims_contexts_* variables
 */
function parseImsContextEnvVars(envVars) {
  return Object.entries(envVars)
    .filter(([key]) => key.startsWith("AIO_ims_contexts_"))
    .map(([key, value]) => ({
      ...parseAioImsContextKey(key),
      value,
    }));
}

/**
 * Parses the AIO_ims_contexts_* key to extract the credential and key.
 * @param {string} imsKey the environment variable key that starts with 'AIO_ims_contexts_'
 * @returns {object} an object containing the credential and key extracted from the imsKey
 */
function parseAioImsContextKey(imsKey) {
  const str = imsKey.replace("AIO_ims_contexts_", "");
  const [credential, key] = splitBySingleChar(str, "_");
  return { credential, key };
}

/**
 * Splits a string by a single character, ensuring that the character is not preceded or followed by the same character.
 * @param {string} str the string to split
 * @param {string} char the character to split by
 * @returns {Array} an array of strings split by the specified character
 */
function splitBySingleChar(str, char) {
  const result = [];
  let current = "";
  let i = 0;
  while (i < str.length) {
    if (
      str[i] === char &&
      (i === 0 || str[i - 1] !== char) && // not preceded by underscore
      (i === str.length - 1 || str[i + 1] !== char) // not followed by underscore
    ) {
      result.push(current);
      current = "";
      i++; // skip the underscore
    } else {
      current += str[i];
      i++;
    }
  }
  result.push(current);
  return result;
}

module.exports = { main };
