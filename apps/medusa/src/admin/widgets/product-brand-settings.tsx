import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import {
  Container,
  Heading,
  Button,
  IconButton,
  Drawer,
  Select,
  Input,
  Text,
  toast,
} from "@medusajs/ui"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { EllipsisVertical, PlusMini } from "@medusajs/icons"
import { useState } from "react"
import { sdk } from "../lib/sdk"

// Typ-Erweiterung für die Query
type AdminProductBrand = AdminProduct & {
  brand?: { id: string; name: string }
}

type Brand = { id: string; name: string }

const fetchBrands = async () => {
  return await sdk.client.fetch("/admin/brands")
}

const linkBrandToProduct = async (productId: string, brandId: string) => {
  const payload = { additional_data: { brand_id: brandId } }
  const response = await fetch(`/admin/products/${productId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw new Error(await response.text())
  return response.json()
}

const createBrandRequest = async (name: string) => {
  const response = await fetch(`/admin/brands`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  })
  if (!response.ok) throw new Error(await response.text())
  return response.json()
}

const ProductBrandSettingsWidget = ({
                                      data: product,
                                    }: DetailWidgetProps<AdminProduct>) => {
  // Frische Produktdaten auslesen (inkl. Brand)
  const { data: freshProduct } = useQuery({
    queryFn: () => sdk.admin.product.retrieve(product.id, { fields: "+brand.*" }),
    queryKey: [["product", product.id]],
    // enabled: !!product.id,
  })
  const resolvedProduct = freshProduct?.product as AdminProductBrand

  const [open, setOpen] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState(product.brand?.id)
  const [showNewBrandInput, setShowNewBrandInput] = useState(false)
  const [newBrandName, setNewBrandName] = useState("")
  const queryClient = useQueryClient()

  // Marken zur Auswahl laden
  const { data: brandsData } = useQuery<{ brands: Brand[] }>({
    queryFn: fetchBrands,
    queryKey: [["brands"]],
  })

  const linkBrand = useMutation({
    mutationFn: (brandId: string) => linkBrandToProduct(product.id, brandId),
    onSuccess: () => {
      toast.success("Brand wurde gesetzt!")
      setOpen(false)
      queryClient.invalidateQueries({ queryKey: [["product", product.id]] })
      queryClient.invalidateQueries({ queryKey: [["brands"]] })
    },
    onError: (error: any) => {
      toast.error(`Fehler beim Setzen der Brand: ${error?.message}`)
    },
  })

  const createBrand = useMutation({
    mutationFn: createBrandRequest,
    onSuccess: (data: { brand: Brand }) => {
      toast.success("Brand angelegt!")
      setShowNewBrandInput(false)
      setNewBrandName("")
      setSelectedBrand(data.brand.id)
      queryClient.invalidateQueries({ queryKey: [["brands"]] })
    },
    onError: (error: any) => {
      toast.error(`Fehler beim Anlegen der Brand: ${error?.message}`)
    },
  })

  // Immer aktuelle Brand bei jedem Render anzeigen
  const currentBrandName = resolvedProduct?.brand?.name || <span className="text-ui-fg-muted">Nicht gesetzt</span>

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Brand</Heading>
        <Drawer open={open} onOpenChange={setOpen}>
          <Drawer.Trigger asChild>
            <IconButton variant="secondary" size="tiny">
              <EllipsisVertical />
            </IconButton>
          </Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title asChild>
                <Heading level="h3">Brand für Produkt ändern</Heading>
              </Drawer.Title>
            </Drawer.Header>
            <Drawer.Body className="p-4">
              <div className="space-y-4">
                <Select
                  value={selectedBrand || ""}
                  onValueChange={setSelectedBrand}
                >
                  <Select.Trigger>
                    <Select.Value placeholder="Brand auswählen" />
                  </Select.Trigger>
                  <Select.Content>
                    {(brandsData?.brands ?? []).map((b) => (
                      <Select.Item key={b.id} value={b.id}>
                        {b.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
                {showNewBrandInput && (
                  <div className="space-y-2">
                    <Input
                      value={newBrandName}
                      placeholder="Neue Brand eingeben"
                      onChange={(e) => setNewBrandName(e.target.value)}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => createBrand.mutate(newBrandName)}
                        disabled={!newBrandName || createBrand.isPending}
                        size="small"
                      >
                        <PlusMini className="mr-2" />
                        {createBrand.isPending ? "Wird angelegt..." : "Anlegen"}
                      </Button>
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => {
                          setShowNewBrandInput(false)
                          setNewBrandName("")
                        }}
                      >
                        Abbrechen
                      </Button>
                    </div>
                  </div>
                )}
                {!showNewBrandInput && (
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => setShowNewBrandInput(true)}
                  >
                    <PlusMini className="mr-2" />
                    Neue Brand anlegen
                  </Button>
                )}
              </div>
            </Drawer.Body>
            <Drawer.Footer>
              <Drawer.Close asChild>
                <Button variant="secondary">Schließen</Button>
              </Drawer.Close>
              <Button
                onClick={() => selectedBrand && linkBrand.mutate(selectedBrand)}
                disabled={!selectedBrand || linkBrand.isPending}
              >
                {linkBrand.isPending ? "Wird gespeichert..." : "Speichern"}
              </Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer>
      </div>
      {/* Sichtbare Anzeige des aktuellen Brands */}
      <div className="px-6 py-4">
        <Text>
          {resolvedProduct?.brand?.name || "-"}
        </Text>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.before",
})

export default ProductBrandSettingsWidget
