// src/workflows/hooks/updated-product.ts
import { updateProductsWorkflow } from "@medusajs/medusa/core-flows"
import { StepResponse } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"
import { BRAND_MODULE } from "../../modules/brand"
import BrandModuleService from "../../modules/brand/service"

updateProductsWorkflow.hooks.productsUpdated(
  async ({ products, additional_data }, { container }) => {
    // Prüfe ob brand_id gesetzt ist
    if (!additional_data?.brand_id) {
      return new StepResponse([], [])
    }

    console.log("Updating brand for products:", products.map(p => p.id))
    console.log("Brand ID:", additional_data.brand_id)

    const brandModuleService: BrandModuleService = container.resolve(BRAND_MODULE)
    const link = container.resolve("link")
    const logger = container.resolve("logger")

    try {
      // Verifiziere dass Brand existiert
      await brandModuleService.retrieveBrand(additional_data.brand_id as string)

      const links = []

      for (const product of products) {
        // Entferne bestehende Brand-Links
        try {
          const existingLinks = await link.list({
            [Modules.PRODUCT]: { product_id: product.id },
          })

          const brandLinks = existingLinks.filter(link =>
            link[BRAND_MODULE] && link[BRAND_MODULE].brand_id
          )

          if (brandLinks.length > 0) {
            await link.dismiss(brandLinks)
            logger.info(`Removed existing brand links for product ${product.id}`)
          }
        } catch (error) {
          logger.warn(`Could not remove existing links: ${error.message}`)
        }

        // Erstelle neue Brand-Verknüpfung
        links.push({
          [Modules.PRODUCT]: { product_id: product.id },
          [BRAND_MODULE]: { brand_id: additional_data.brand_id },
        })
      }

      await link.create(links)
      logger.info(`Created ${links.length} brand links`)

      return new StepResponse(links, links)

    } catch (error) {
      logger.error(`Brand update failed: ${error.message}`)
      return new StepResponse([], [])
    }
  },
  async (links, { container }) => {
    if (!links?.length) return

    const link = container.resolve("link")
    try {
      await link.dismiss(links)
    } catch (error) {
      console.error("Compensation failed:", error)
    }
  }
)
