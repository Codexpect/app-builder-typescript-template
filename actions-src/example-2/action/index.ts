import { initializeLogger, logError } from "../../logger";
import { actionErrorResponse, actionSuccessResponse } from "../../responses";
import { getStateClient } from "../../utils/lib-state/state-client";
import { getFilesClient } from "../../utils/lib-files/files-client";
import { AppResponse, HttpStatus } from "../../types/request";
import { AdobeCommerceClient } from "../../utils/adobe-commerce/adobe-commerce-client";
import { EventCode, ProviderKey, publishEvent } from "../../utils/io-events/adobe-events-api";
import { Product } from "./types/product";
import { ProcessFunctionParams } from "./types/request";

export async function main(params: ProcessFunctionParams): Promise<AppResponse> {
  initializeLogger("process-function");

  try {
    validateProduct(params.data);

    const storeConfig = { storeCode: "us", storeUrl: "https://us.example.com" };
    const client = AdobeCommerceClient.create(params, storeConfig);
    // do something here

    // or publish event
    await publishEvent(
      params,
      {
        productId: params.data.id,
        productName: params.data.name,
      },
      ProviderKey.COMMERCE,
      EventCode.PRODUCT_CREATED
    );

    // or use lib state for temporary storage
    const stateClient = await getStateClient();
    await stateClient.put("key", "value", {
      ttl: 1000 * 60 * 60 * 24, // 24 hours
    });

    // or use lib files for permanent storage
    const filesClient = await getFilesClient();
    await filesClient.write("path", "content");

    return actionSuccessResponse("Product review summarization completed");
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logError(`Server error: ${errorMessage}`);
    return actionErrorResponse(HttpStatus.INTERNAL_ERROR, `Request failed: ${errorMessage}`);
  }
}

function validateProduct(product: Product): void {
  if (!product.id) {
    throw new Error("Product ID is required");
  }
}
