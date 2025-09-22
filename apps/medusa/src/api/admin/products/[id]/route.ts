import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// PATCH: Brand im Produkt über additionalData setzen
export const PATCH = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params
  const { additionalData } = req.body // erwartet { additionalData: { brand_id: "..." } }
  const productModuleService = req.scope.resolve("productModuleService")

  console.log("additionalData" + JSON.stringify(additionalData))

  // Setze die Brand in additionalData
  const updated = await productModuleService.update(id, {
    additionalData,
  })

  res.json({ product: updated })
}
