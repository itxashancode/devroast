import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // Use environment variable for URL if available, otherwise default to localhost or a placeholder
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://devroast.vercel.app';

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/leaderboard`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];
}
