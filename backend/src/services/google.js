import { google } from 'googleapis';
import { log } from './logger.js';

export function getGoogleAuth() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_REFRESH_TOKEN) {
    throw new Error('Google OAuth credentials not configured');
  }
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return oauth2Client;
}

export async function fetchGscQueries(domainUrl, days = 30) {
  const auth = getGoogleAuth();
  const searchconsole = google.searchconsole({ version: 'v1', auth });

  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const response = await searchconsole.searchanalytics.query({
    siteUrl: `sc-domain:${domainUrl}`,
    requestBody: {
      startDate, endDate,
      dimensions: ['query'],
      rowLimit: 100,
      type: 'web',
    },
  });

  return {
    domain: domainUrl,
    period: { startDate, endDate },
    rows: (response.data.rows || []).map(row => ({
      query: row.keys[0],
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: Math.round(row.ctr * 1000) / 10,
      position: Math.round(row.position * 10) / 10,
    })),
  };
}

export async function fetchGscPages(domainUrl, days = 30) {
  const auth = getGoogleAuth();
  const searchconsole = google.searchconsole({ version: 'v1', auth });

  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const response = await searchconsole.searchanalytics.query({
    siteUrl: `sc-domain:${domainUrl}`,
    requestBody: { startDate, endDate, dimensions: ['page'], rowLimit: 50, type: 'web' },
  });

  return { rows: response.data.rows || [] };
}

export async function fetchPageSpeed(targetUrl) {
  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://${targetUrl}&strategy=mobile&category=performance&category=seo`;
  const response = await fetch(apiUrl);
  const data = await response.json();

  if (data.error) throw new Error(data.error.message);

  const metrics = data.lighthouseResult?.audits;
  return {
    performance: Math.round((data.lighthouseResult?.categories?.performance?.score || 0) * 100),
    seo: Math.round((data.lighthouseResult?.categories?.seo?.score || 0) * 100),
    lcp: metrics?.['largest-contentful-paint']?.numericValue,
    cls: metrics?.['cumulative-layout-shift']?.numericValue,
    tbt: metrics?.['total-blocking-time']?.numericValue,
    ttfb: metrics?.['server-response-time']?.numericValue,
  };
}

export async function requestIndexing(url) {
  const auth = getGoogleAuth();
  const indexing = google.indexing({ version: 'v3', auth });
  const response = await indexing.urlNotifications.publish({
    requestBody: { url, type: 'URL_UPDATED' },
  });
  log.info(`Indexing requested: ${url}`);
  return response.data;
}
