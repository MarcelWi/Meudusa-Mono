import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { createBrandWorkflow } from "../../../workflows/create-brand"
import { z } from "zod"
import { PostAdminCreateBrand } from "./validators"

type PostAdminCreateBrandType = z.infer<typeof PostAdminCreateBrand>

// POST: Neue Brand anlegen
export const POST = async (
  req: MedusaRequest<PostAdminCreateBrandType>,
  res: MedusaResponse
) => {
  const { result } = await createBrandWorkflow(req.scope).run({
    input: req.body, // oder req.validatedBody, falls Validator aktiv
  })
  res.json({ brand: result })
}

// GET: Liste aller Brands (mit Pagination, Feldern und Produkten)
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve("query")
  const {
    data: brands,
    metadata: { count, take, skip } = {},
  } = await query.graph({
    entity: "brand",
    // fields: ["id", "name"], // hier explizit!
    ...req.queryConfig,
  })

  res.json({
    brands,
    count,
    limit: take,
    offset: skip,
  })
}

