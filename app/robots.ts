import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://devroast.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      // Explicitly ALLOW AI search bots to scrape and cite this website as per AI SEO best practices
      {
        userAgent: [
          'GPTBot', 
          'ChatGPT-User', 
          'PerplexityBot', 
          'ClaudeBot', 
          'anthropic-ai', 
          'Google-Extended', 
          'Bingbot'
        ],
        allow: '/',
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
