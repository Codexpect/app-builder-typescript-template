const { Core } = require("@adobe/aio-sdk");
const { replaceEnvVar } = require("./lib/env.js");

const logger = Core.Logger("scripts/sync-default-configuration", { level: process.env.LOG_LEVEL || "info" });

/**
 * Main function to sync default configuration.
 */
function main() {
  try {
    replaceEnvVar(null, "IO_MANAGEMENT_BASE_URL", "https://api.adobe.io/events/");
    replaceEnvVar(null, "OAUTH_HOST", "https://ims-na1.adobelogin.com");
    logger.info("Default configuration synced successfully");
  } catch (e) {
    logger.error("Failed to sync workspace configuration", e);
  }
}

module.exports = { main };
