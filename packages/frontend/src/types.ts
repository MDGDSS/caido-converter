import { type Caido } from "@caido/sdk-frontend";
import { type API, type Result } from "backend";

export type FrontendSDK = Caido<API, Record<string, never>>;

export type ConversionType = {
  id: string;
  name: string;
  description: string;
};
