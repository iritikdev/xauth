import { MetadataRoute } from 'next'
import { getAllProducts } from '@/lib/actions/product' // Aapka existing action

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://amazeayurveda.in"

  // 1. Static Routes (Jo hamesha same rehte hain)
  const staticRoutes = [
    "",
    "/shop",
    "/plan",
    "/about",
    "/contact",
    "/sign-in",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === "" ? 1 : 0.8, // Home page ko sabse zyada priority
  }))

  // 2. Dynamic Product Routes (Database se products fetch karein)
  try {
    const products = await getAllProducts()
    const productRoutes = products.map((product: any) => ({
      url: `${baseUrl}/shop/${product.id}`, // Ya product.slug agar aap slug use kar rahe hain
      lastModified: new Date(product.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    return [...staticRoutes, ...productRoutes]
  } catch (error) {
    console.error("Sitemap generation error:", error)
    return staticRoutes
  }
}