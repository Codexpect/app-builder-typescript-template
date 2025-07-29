import filesLib, { FilesClient } from "@adobe/aio-lib-files";
import { logError, logInfo } from "../../logger";

let filesClient: FilesClient | null = null;

/**
 * Initialize the files client for file operations
 *
 * @param options Options for files client initialization
 * @returns Files client
 */
export async function getFilesClient(): Promise<FilesClient> {
  if (!filesClient) {
    try {
      filesClient = await filesLib.init();

      logInfo("Files client initialized successfully");
    } catch (error) {
      logError("Failed to initialize files client: " + String(error));
      throw new Error(`Files initialization failed: ${String(error)}`);
    }
  }
  return filesClient;
}
