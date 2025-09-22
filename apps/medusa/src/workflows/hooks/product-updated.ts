import { StepResponse } from "@medusajs/framework/workflows-sdk"
import { updateProductsWorkflow } from "@medusajs/medusa/core-flows"
import { Modules } from "@medusajs/framework/utils"

updateProductsWorkflow.hooks.productsUpdated(
  async ({ products, additional_data }, { container }) => {
    if (!additional_data?.brand_id) return
    const productModuleService = container.resolve(Modules.PRODUCT)
    await productModuleService.upsertProducts(
      products.map(product => ({
        ...product,
        metadata: {
          ...product.metadata,
          brand_id: additional_data.brand_id,
        }
      }))
    )
    return new StepResponse(products, { products, additional_data })
  }
)
