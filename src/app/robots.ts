import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://amazeayurveda.in"

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',    // User private data protect karein
          '/admin/',        // Admin panel hide karein
          '/api/',          // Backend routes crawl na hon
          '/_next/',        // Internal Next.js files
          '/sign-in',       // Auth pages crawling zaroori nahi
          '/sign-up',
        ],
      },
      {
        userAgent: 'GPTBot', // AI bots ko block karne ke liye (Optional)
        disallow: '/',
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}