import { StepResponse } from "@medusajs/framework/workflows-sdk"
import { createProductsWorkflow } from "@medusajs/medusa/core-flows"
import { BRAND_MODULE } from "../../modules/brand"
import { Modules } from "@medusajs/framework/utils"
import { LinkDefinition } from "@medusajs/framework/types"

type ProductsCreatedInput = {
  products: Array<{ id: string }>
  additional_data?: { brand_id?: string }
}

type CompensationInput = {
  product_ids: string[]
  brand_id: string
}

createProductsWorkflow.hooks.productsCreated<ProductsCreatedInput, CompensationInput>(
  async ({ products, additional_data }, { container }) => {
    const brandId = additional_data?.brand_id
    if (!brandId) return new StepResponse(undefined, undefined)

    // Service holen und Brand validieren (Error, wenn nicht gefunden):
    const brandModuleService = container.resolve(BRAND_MODULE)
    await brandModuleService.retrieveBrand(brandId)

    const link = container.resolve("link")
    const logger = container.resolve("logger")
    const links: LinkDefinition[] = []

    // Für jedes Produkt die Link-Relation bauen:
    for (const product of products) {
      links.push({
        [Modules.PRODUCT]: { product_id: product.id },
        [BRAND_MODULE]: { brand_id: brandId }
      })
    }

    // Bulk-Link setzen:
    await link.create(links)
    logger.info(`Linked brand ${brandId} to products: ${products.map(p => p.id).join(", ")}`)

    return new StepResponse({ success: true }, { product_ids: products.map(p => p.id), brand_id: brandId })
  },
  async ({ product_ids, brand_id }, { container }) => {
    // Rollback: Links wieder entfernen
    const link = container.resolve("link")
    const links: LinkDefinition[] = []
    for (const product_id of product_ids) {
      links.push({
        [Modules.PRODUCT]: { product_id },
        [BRAND_MODULE]: { brand_id }
      })
    }
    await link.dismiss(links)
  }
)
