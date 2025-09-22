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

type Brand = { id: string; name: string }

const ProductBrandSettingsWidget = ({
                                      data: product,
                                    }: DetailWidgetProps<AdminProduct>) => {
  const [open, setOpen] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<string | undefined>(
    product.brand?.id
  )
  const [showNewBrandInput, setShowNewBrandInput] = useState(false)
  const [newBrandName, setNewBrandName] = useState("")

  const queryClient = useQueryClient()

  // Marken laden
  const { data, isLoading } = useQuery<{ brands: Brand[] }>({
    queryFn: () => sdk.client.fetch("/admin/brands"),
    queryKey: [["brands"]],
  })

  // Brand am Produkt setzen
  const linkBrand = useMutation({
    mutationFn: (brand_id: string) =>
      sdk.client.fetch(`/admin/products/${product.id}`, {
        method: "POST",
        additional_data: { brand_id }
      }),
    onSuccess: () => {
      toast.success("Brand wurde gesetzt!")
      setOpen(false)
      queryClient.invalidateQueries([["products", product.id]])
      queryClient.invalidateQueries([["brands"]])
    },
  })

  // Neue Brand anlegen
  const createBrand = useMutation({
    mutationFn: (name: string) =>
      sdk.client.fetch(`/admin/brands`, {
        method: "POST",
        body: { name },
      }),
    onSuccess: (data: { brand: Brand }) => {
      toast.success("Brand angelegt!")
      setShowNewBrandInput(false)
      setNewBrandName("")
      setSelectedBrand(data.brand.id)
      queryClient.invalidateQueries([["brands"]])
    },
  })

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
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <Select.Trigger>
                  <Select.Value placeholder="Brand auswählen" />
                </Select.Trigger>
                <Select.Content>
                  {(data?.brands ?? []).map((b) => (
                    <Select.Item key={b.id} value={b.id}>
                      {b.name}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>

              {showNewBrandInput ? (
                <>
                  <Input
                    value={newBrandName}
                    placeholder="Neue Brand eingeben"
                    onChange={(e) => setNewBrandName(e.target.value)}
                    autoFocus
                  />
                  <div className="flex gap-2 mt-2">
                    <Button
                      onClick={() => createBrand.mutate(newBrandName)}
                      disabled={!newBrandName}
                    >
                      <PlusMini className="mr-2" />
                      Anlegen
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setShowNewBrandInput(false)
                        setNewBrandName("")
                      }}
                    >
                      Abbrechen
                    </Button>
                  </div>
                </>
              ) : (
                <Button
                  variant="secondary"
                  size="tiny"
                  className="mt-2"
                  onClick={() => setShowNewBrandInput(true)}
                >
                  <PlusMini className="mr-2" />
                  Neue Brand anlegen
                </Button>
              )}
            </Drawer.Body>
            <Drawer.Footer>
              <Drawer.Close asChild>
                <Button variant="secondary">Schließen</Button>
              </Drawer.Close>
              <Button
                onClick={() => selectedBrand && linkBrand.mutate(selectedBrand)}
                disabled={!selectedBrand}
              >
                Speichern
              </Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer>
      </div>
      <div className="px-6 py-4">
        <Text>
          {product.brand?.name || (
            <span className="text-ui-fg-muted">Nicht gesetzt</span>
          )}
        </Text>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.before",
})

export default ProductBrandSettingsWidget
