/**
 * Store products catalog for customer try-on.
 * Add your products here so customers can choose which clothes to try on themselves.
 *
 * imageUrl: Use a clear product photo (garment on white background or flat lay).
 * You can host images on ImgBB, Cloudinary, or your own CDN.
 */

export interface StoreProduct {
  id: string
  name: string
  description?: string
  imageUrl: string
  /** Optional: price for display (e.g. "€49") */
  price?: string
}

export const STORE_PRODUCTS: StoreProduct[] = [
  {
    id: "classic-tee-1",
    name: "Classic White Tee",
    description: "Premium cotton t-shirt",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    price: "€29",
  },
  {
    id: "denim-jacket",
    name: "Denim Jacket",
    description: "Vintage fit denim",
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
    price: "€79",
  },
  {
    id: "hoodie-navy",
    name: "Navy Hoodie",
    description: "Soft fleece hoodie",
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
    price: "€55",
  },
]

export function getStoreProduct(id: string): StoreProduct | undefined {
  return STORE_PRODUCTS.find((p) => p.id === id)
}

export function getStoreProducts(): StoreProduct[] {
  return STORE_PRODUCTS
}
