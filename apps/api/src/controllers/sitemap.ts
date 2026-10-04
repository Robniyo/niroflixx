import { Request, Response } from 'express';
import { prisma } from '../models/prisma';

const BASE_URL = 'https://fscholars.online';

function urlEntry(loc: string, lastmod?: Date | null, changefreq = 'weekly', priority = '0.7') {
  const lastmodTag = lastmod ? `<lastmod>${lastmod.toISOString().split('T')[0]}</lastmod>` : '';
  return `  <url>\n    <loc>${loc}</loc>\n    ${lastmodTag}\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
}

export const sitemapController = {
  get: async (_req: Request, res: Response) => {
    try {
      const [opportunities, courses, services, news, resources] = await Promise.all([
        prisma.opportunity.findMany({
          where: { status: 'PUBLISHED' },
          select: { id: true, updatedAt: true },
        }),
        prisma.course.findMany({
          where: { status: 'PUBLISHED' },
          select: { slug: true, updatedAt: true },
        }),
        prisma.service.findMany({
          where: { status: 'PUBLISHED' },
          select: { slug: true, updatedAt: true },
        }),
        prisma.news.findMany({
          where: { status: 'PUBLISHED' },
          select: { slug: true, updatedAt: true },
        }),
        prisma.resource.findMany({
          where: { status: 'PUBLISHED' },
          select: { slug: true, updatedAt: true },
        }),
      ]);

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

      // Main pages
      xml += urlEntry(`${BASE_URL}/`, null, 'daily', '1.0');
      xml += urlEntry(`${BASE_URL}/opportunities`, null, 'daily', '0.9');
      xml += urlEntry(`${BASE_URL}/news`, null, 'daily', '0.9');
      xml += urlEntry(`${BASE_URL}/academy`, null, 'weekly', '0.8');
      xml += urlEntry(`${BASE_URL}/services`, null, 'weekly', '0.8');
      xml += urlEntry(`${BASE_URL}/resources`, null, 'weekly', '0.7');
      xml += urlEntry(`${BASE_URL}/about`, null, 'monthly', '0.5');
      xml += urlEntry(`${BASE_URL}/contact`, null, 'monthly', '0.5');
      xml += urlEntry(`${BASE_URL}/privacy`, null, 'yearly', '0.3');
      xml += urlEntry(`${BASE_URL}/terms`, null, 'yearly', '0.3');

      // Dynamic pages
      opportunities.forEach(o => {
        xml += urlEntry(`${BASE_URL}/opportunities/${o.id}`, o.updatedAt, 'weekly', '0.8');
      });
      courses.forEach(c => {
        xml += urlEntry(`${BASE_URL}/academy/${c.slug}`, c.updatedAt, 'weekly', '0.7');
      });
      services.forEach(s => {
        xml += urlEntry(`${BASE_URL}/services/${s.slug}`, s.updatedAt, 'weekly', '0.7');
      });
      news.forEach(n => {
        xml += urlEntry(`${BASE_URL}/news/${n.slug}`, n.updatedAt, 'weekly', '0.7');
      });
      resources.forEach(r => {
        xml += urlEntry(`${BASE_URL}/resources/${r.slug}`, r.updatedAt, 'weekly', '0.6');
      });

      xml += `</urlset>`;

      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.send(xml);
    } catch (error) {
      console.error('SITEMAP ERROR:', error);
      res.status(500).send('Error generating sitemap');
    }
  },
};