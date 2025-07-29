import { AdobeAuthParams, AdobeImsParams, BaseParams, DataParams } from "../../../types/request";
import { CommerceParams } from "../../../utils/adobe-commerce/types/request";
import { Product } from "./product";

export interface ExampleParams {
  EXAMPLE_PARAM: string;
}

export type ProcessFunctionParams = BaseParams &
  CommerceParams &
  AdobeAuthParams &
  AdobeImsParams &
  ExampleParams &
  DataParams<Product>;
