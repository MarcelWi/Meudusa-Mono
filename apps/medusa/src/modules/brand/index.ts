import { Module } from "@medusajs/framework/utils"
import { Brand } from "./models/brand"
import BrandModuleService from "./service"

export const BRAND_MODULE = "brand"

export default Module(BRAND_MODULE, {
  service: BrandModuleService,
  models: [Brand],
})
