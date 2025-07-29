import stateLib, { AdobeState } from "@adobe/aio-lib-state";
import { logError, logInfo } from "../../logger";

let stateClient: any = null;

/**
 * Initialize the state client
 *
 * @param options Options for state client initialization
 * @returns State client
 */
export async function getStateClient(options: { region?: string } = {}): Promise<AdobeState> {
  if (!stateClient) {
    try {
      stateClient = await stateLib.init({
        region: options.region || "amer",
      });
      logInfo("State client initialized successfully");
    } catch (error) {
      logError("Failed to initialize state client: " + String(error));
      throw new Error(`State initialization failed: ${String(error)}`);
    }
  }
  return stateClient;
}
