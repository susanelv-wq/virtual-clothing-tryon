import { NextResponse } from "next/server"

export const revalidate = 600

const STORE_API =
  "https://oceanheaven.shop/wp-json/wc/store/v1/products?per_page=50&status=publish"

function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").trim()
}

/**
 * Live product catalog for the try-on page, pulled from the
 * Ocean Heaven WooCommerce store (oceanheaven.shop).
 */
export async function GET() {
  try {
    const res = await fetch(STORE_API, {
      headers: { Accept: "application/json" },
      next: { revalidate: 600 },
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) throw new Error(`Store API ${res.status}`)
    const data = await res.json()
    if (!Array.isArray(data)) throw new Error("Unexpected store API response")

    const products = data
      .filter((p: any) => Array.isArray(p?.images) && p.images.length > 0)
      .map((p: any) => {
        const minor = Number(p.prices?.currency_minor_unit ?? 2)
        const raw = Number(p.prices?.price ?? 0)
        const amount = raw / Math.pow(10, minor)
        const symbol = p.prices?.currency_symbol || p.prices?.currency_code || ""
        const price =
          amount > 0 ? `${symbol} ${amount.toLocaleString("id-ID")}` : undefined
        return {
          id: String(p.id),
          name: stripHtml(p.name || "Product"),
          description: stripHtml(p.short_description || ""),
          imageUrl: p.images[0].src as string,
          price,
        }
      })

    return NextResponse.json({ products })
  } catch (e) {
    console.error("store-products fetch failed:", e)
    return NextResponse.json({ products: [] })
  }
}
