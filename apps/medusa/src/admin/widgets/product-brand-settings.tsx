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
import { useState, useCallback, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { sdk } from "../lib/sdk"

// Zod Schemas
const BrandSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Brand-Name darf nicht leer sein"),
})

const BrandsResponseSchema = z.object({
  brands: z.array(BrandSchema),
})

const CreateBrandFormSchema = z.object({
  name: z.string()
    .min(1, "Brand-Name ist erforderlich")
    .max(100, "Brand-Name darf maximal 100 Zeichen haben")
    .trim()
    .refine(name => name.length > 0, "Brand-Name darf nicht nur aus Leerzeichen bestehen"),
})

const SelectBrandFormSchema = z.object({
  brandId: z.string().min(1, "Bitte wählen Sie eine Brand aus"),
})

const CreateBrandResponseSchema = z.object({
  brand: BrandSchema,
})

const LinkBrandRequestSchema = z.object({
  additional_data: z.object({
    brand_id: z.string().uuid("Ungültige Brand-ID"),
  }),
})

const AdminProductWithBrandSchema = z.object({
  id: z.string(),
  brand: BrandSchema.optional(),
}).passthrough()

// Type definitions (inferred from schemas)
type Brand = z.infer<typeof BrandSchema>
type BrandsResponse = z.infer<typeof BrandsResponseSchema>
type CreateBrandForm = z.infer<typeof CreateBrandFormSchema>
type SelectBrandForm = z.infer<typeof SelectBrandFormSchema>
type CreateBrandResponse = z.infer<typeof CreateBrandResponseSchema>
type AdminProductWithBrand = z.infer<typeof AdminProductWithBrandSchema> & AdminProduct

// API functions with Zod validation
const brandApi = {
  fetchBrands: async (): Promise<BrandsResponse> => {
    try {
      const response = await sdk.client.fetch("/admin/brands")
      return BrandsResponseSchema.parse(response)
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Invalid brands response format:", error.errors)
        throw new Error("Ungültiges Datenformat beim Laden der Brands")
      }
      throw error
    }
  },

  createBrand: async (data: CreateBrandForm): Promise<CreateBrandResponse> => {
    const response = await fetch("/admin/brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to create brand: ${errorText}`)
    }

    const responseData = await response.json()

    try {
      return CreateBrandResponseSchema.parse(responseData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Invalid create brand response format:", error.errors)
        throw new Error("Ungültiges Antwortformat vom Server")
      }
      throw error
    }
  },

  linkBrandToProduct: async (productId: string, brandId: string): Promise<any> => {
    // Validate inputs
    const productIdSchema = z.string().min(1, "Ungültige Produkt-ID")
    const brandIdSchema = z.string().uuid("Ungültige Brand-ID")

    try {
      productIdSchema.parse(productId)
      brandIdSchema.parse(brandId)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(error.errors[0]?.message || "Ungültige Parameter")
      }
      throw error
    }

    const requestData = LinkBrandRequestSchema.parse({
      additional_data: { brand_id: brandId }
    })

    const response = await fetch(`/admin/products/${productId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to link brand to product: ${errorText}`)
    }

    return response.json()
  }
}

// Custom hooks
const useProductWithBrand = (productId: string) => {
  return useQuery({
    queryKey: ["product", productId, "with-brand"],
    queryFn: async () => {
      const data = await sdk.admin.product.retrieve(productId, { fields: "+brand.*" })
      return data?.product as AdminProductWithBrand
    },
  })
}

const useBrands = () => {
  return useQuery({
    queryKey: ["brands"],
    queryFn: brandApi.fetchBrands,
    select: (data) => data?.brands || [],
  })
}

const useLinkBrandMutation = (productId: string, onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (brandId: string) => brandApi.linkBrandToProduct(productId, brandId),
    onSuccess: () => {
      toast.success("Brand wurde erfolgreich gesetzt!")
      queryClient.invalidateQueries({ queryKey: ["product", productId] })
      queryClient.invalidateQueries({ queryKey: ["brands"] })
      onSuccess?.()
    },
    onError: (error: Error) => {
      toast.error(`Fehler beim Setzen der Brand: ${error.message}`)
    },
  })
}

const useCreateBrandMutation = (onSuccess?: (brand: Brand) => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: brandApi.createBrand,
    onSuccess: (data) => {
      toast.success("Brand wurde erfolgreich angelegt!")
      queryClient.invalidateQueries({ queryKey: ["brands"] })
      onSuccess?.(data.brand)
    },
    onError: (error: Error) => {
      toast.error(`Fehler beim Anlegen der Brand: ${error.message}`)
    },
  })
}

// Form Components
const CreateBrandForm = ({
                           onSuccess,
                           onCancel,
                           isLoading = false
                         }: {
  onSuccess: (brand: Brand) => void
  onCancel: () => void
  isLoading?: boolean
}) => {
  const createBrandMutation = useCreateBrandMutation(onSuccess)

  const form = useForm<CreateBrandForm>({
    resolver: zodResolver(CreateBrandFormSchema),
    defaultValues: {
      name: "",
    },
    mode: "onChange", // Validate on every change
  })

  const onSubmit = (data: CreateBrandForm) => {
    createBrandMutation.mutate(data)
  }

  const isSubmitting = createBrandMutation.isPending

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <>
              <Input
                {...field}
                placeholder="Neue Brand eingeben (max. 100 Zeichen)"
                className={fieldState.error ? "border-red-500" : ""}
                disabled={isSubmitting || isLoading}
                maxLength={100}
                autoFocus
              />
              {fieldState.error && (
                <Text size="small" className="text-red-500">
                  {fieldState.error.message}
                </Text>
              )}
            </>
          )}
        />
      </div>

      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={!form.formState.isValid || isSubmitting || isLoading}
          size="small"
        >
          <PlusMini className="mr-2" />
          {isSubmitting ? "Wird angelegt..." : "Anlegen"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="small"
          onClick={onCancel}
          disabled={isSubmitting || isLoading}
        >
          Abbrechen
        </Button>
      </div>
    </form>
  )
}

const SelectBrandForm = ({
                           brands,
                           onSubmit,
                           isLoading = false,
                           isSaving = false
                         }: {
  brands: Brand[]
  onSubmit: (brandId: string) => void
  isLoading?: boolean
  isSaving?: boolean
}) => {
  const form = useForm<SelectBrandForm>({
    resolver: zodResolver(SelectBrandFormSchema),
    defaultValues: {
      brandId: "",
    },
    mode: "onChange",
  })

  const handleSubmit = (data: SelectBrandForm) => {
    onSubmit(data.brandId)
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <Controller
        name="brandId"
        control={form.control}
        render={({ field, fieldState }) => (
          <div className="space-y-1">
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={isLoading || isSaving}
            >
              <Select.Trigger className={fieldState.error ? "border-red-500" : ""}>
                <Select.Value placeholder="Brand auswählen" />
              </Select.Trigger>
              <Select.Content>
                {brands.map((brand) => (
                  <Select.Item key={brand.id} value={brand.id}>
                    {brand.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
            {fieldState.error && (
              <Text size="small" className="text-red-500">
                {fieldState.error.message}
              </Text>
            )}
          </div>
        )}
      />

      <Button
        type="submit"
        disabled={!form.formState.isValid || isSaving || isLoading}
        className="w-full"
      >
        {isSaving ? "Wird gespeichert..." : "Speichern"}
      </Button>
    </form>
  )
}

// Main Component
const ProductBrandSettingsWidget = ({ data: product }: DetailWidgetProps<AdminProduct>) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isCreatingNewBrand, setIsCreatingNewBrand] = useState(false)

  // Data fetching
  const { data: productWithBrand, isLoading: isProductLoading } = useProductWithBrand(product.id)
  const { data: brands = [], isLoading: isBrandsLoading } = useBrands()

  // Mutations
  const linkBrandMutation = useLinkBrandMutation(product.id, () => setIsDrawerOpen(false))

  // Event handlers
  const handleLinkBrand = useCallback((brandId: string) => {
    linkBrandMutation.mutate(brandId)
  }, [linkBrandMutation])

  const handleBrandCreated = useCallback((newBrand: Brand) => {
    setIsCreatingNewBrand(false)
    // Automatically select the newly created brand
    linkBrandMutation.mutate(newBrand.id)
  }, [linkBrandMutation])

  const handleCancelNewBrand = useCallback(() => {
    setIsCreatingNewBrand(false)
  }, [])

  const handleDrawerOpenChange = useCallback((open: boolean) => {
    setIsDrawerOpen(open)
    if (!open) {
      // Reset form state when closing
      setIsCreatingNewBrand(false)
    }
  }, [])

  // Derived state
  const currentBrand = productWithBrand?.brand
  const isLoading = isProductLoading || isBrandsLoading
  const isSaving = linkBrandMutation.isPending

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Brand</Heading>

        <Drawer open={isDrawerOpen} onOpenChange={handleDrawerOpenChange}>
          <Drawer.Trigger asChild>
            <IconButton variant="secondary" size="tiny" disabled={isLoading}>
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
                {!isCreatingNewBrand ? (
                  <>
                    <SelectBrandForm
                      brands={brands}
                      onSubmit={handleLinkBrand}
                      isLoading={isBrandsLoading}
                      isSaving={isSaving}
                    />

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">oder</span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="secondary"
                      size="small"
                      onClick={() => setIsCreatingNewBrand(true)}
                      className="w-full"
                    >
                      <PlusMini className="mr-2" />
                      Neue Brand anlegen
                    </Button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <Heading level="h4" className="text-sm font-medium">
                        Neue Brand erstellen
                      </Heading>
                      <Text size="small" className="text-muted-foreground">
                        Die neue Brand wird automatisch mit diesem Produkt verknüpft.
                      </Text>
                    </div>

                    <CreateBrandForm
                      onSuccess={handleBrandCreated}
                      onCancel={handleCancelNewBrand}
                      isLoading={isLoading}
                    />
                  </div>
                )}
              </div>
            </Drawer.Body>

            <Drawer.Footer>
              <Drawer.Close asChild>
                <Button variant="secondary">Schließen</Button>
              </Drawer.Close>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer>
      </div>

      {/* Current brand display */}
      <div className="px-6 py-4">
        <Text className={!currentBrand ? "text-ui-fg-muted" : ""}>
          {isLoading ? "Lädt..." : (currentBrand?.name || "Nicht gesetzt")}
        </Text>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.before",
})

export default ProductBrandSettingsWidget