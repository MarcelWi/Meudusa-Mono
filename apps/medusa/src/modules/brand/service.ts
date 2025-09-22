import { MedusaService } from "@medusajs/framework/utils"
import { Brand } from "./models/brand"

// Diese Klasse vererbt alle Standard-CRUD-Methoden für das Brand-Modell automatisch
class BrandModuleService extends MedusaService({ Brand }) {}

// Direkter Export, wie von Medusa erwartet
export default BrandModuleService
