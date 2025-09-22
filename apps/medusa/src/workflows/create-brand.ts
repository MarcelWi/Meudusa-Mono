import { createStep, StepResponse, createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { BRAND_MODULE } from "../modules/brand"
import BrandModuleService from "../modules/brand/service"

export type CreateBrandStepInput = {
  name: string
}

export const createBrandStep = createStep<CreateBrandStepInput, string>(
  "create-brand-step",
  async (input, { container }) => {
    // console.log("### create-brand-step INPUT:", input)

    const brandModuleService: BrandModuleService = container.resolve(BRAND_MODULE)
    // console.log("### RESOLVED SERVICE:", !!brandModuleService, brandModuleService)

    const brand = await brandModuleService.createBrands(input)
    // console.log("### CREATED BRAND:", brand)

    return new StepResponse(brand, brand.id)
  },
  async (brandId, { container }) => {
    // console.log("### ROLLBACK brandId:", brandId)
    const brandModuleService: BrandModuleService = container.resolve(BRAND_MODULE)
    await brandModuleService.deleteBrands(brandId)
  }
)


export type CreateBrandWorkflowInput = {
  name: string
}

export const createBrandWorkflow = createWorkflow(
  "create-brand",
  (input: CreateBrandWorkflowInput) => {
    const brand = createBrandStep(input)

    return new WorkflowResponse(brand)
  }
)
