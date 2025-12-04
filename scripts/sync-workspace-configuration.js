const { Core } = require("@adobe/aio-sdk");
const { replaceEnvVar } = require("./lib/env.js");
const path = require("path");

const logger = Core.Logger("scripts/sync-workspace-configuration", { level: process.env.LOG_LEVEL || "info" });

const WORKSPACE_FILE_PATH = "scripts/onboarding/config/workspace.json";

/**
 * Main function to sync OAuth credentials from IMS context environment variables.
 */
function main() {
  try {
    const workspaceConfig = readWorkspaceConfig(WORKSPACE_FILE_PATH);
    const projectId = workspaceConfig.project.id;
    const workspaceId = workspaceConfig.project.workspace.id;
    const consumerID = workspaceConfig.project.org.id;

    replaceEnvVar(null, "IO_PROJECT_ID", projectId);
    replaceEnvVar(null, "IO_WORKSPACE_ID", workspaceId);
    replaceEnvVar(null, "IO_CONSUMER_ID", consumerID);

    logger.info("Workspace configuration synced successfully");
  } catch (e) {
    logger.error("Failed to sync workspace configuration", e);
  }
}

/**
 * Reads the workspace configuration from the workspace file.
 * @returns {object} the workspace configuration
 */
function readWorkspaceConfig(filePath) {
  const absolutePath = path.isAbsolute(filePath) ? filePath : `${process.env.INIT_CWD || process.cwd()}/${filePath}`;
  return require(absolutePath);
}

module.exports = { main };
