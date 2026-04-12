import { MetadataRoute } from 'next'
import { getAllProducts } from "@/lib/actions/product"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://amazeayurveda.in"

  // 1. Static Routes
  const staticRoutes = [
    "",
    "/shop",
    "/business-plan",
    "/about-us",
    "/contact",
    "/sign-in",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === "" ? 1 : 0.8,
  }))

  // 2. Dynamic Product Routes
  try {
    const products = await getAllProducts()
    
    const productRoutes = products.map((product: any) => {
      // ✅ Safety Check: Agar date invalid hai toh current date use karein
      const validDate = product.updatedAt && !isNaN(new Date(product.updatedAt).getTime())
        ? new Date(product.updatedAt)
        : new Date();

      return {
        url: `${baseUrl}/shop/${product.id}`,
        lastModified: validDate,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      };
    })

    return [...staticRoutes, ...productRoutes]
  } catch (error) {
    console.error("Sitemap generation error:", error)
    return staticRoutes
  }
}