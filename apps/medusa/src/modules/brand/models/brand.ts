import { model } from "@medusajs/framework/utils"

export const Brand = model.define("brand", {
  id: model.id().primaryKey(),
  name: model.text(),
  // ggf. Verknüpfung zu Products (optional, meist über Link-Datei geregelt)
})
