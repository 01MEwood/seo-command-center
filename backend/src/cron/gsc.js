import cron from 'node-cron';
import { fetchGscQueries } from '../services/google.js';
import { log } from '../services/logger.js';

export function startCronJobs(prisma) {
  // Daily GSC data fetch at 6:00 AM
  cron.schedule('0 6 * * *', async () => {
    log.info('Running daily GSC data fetch...');
    try {
      for (const domainKey of ['schreinerhelden.de', 'ihr-moebel-schreiner.de']) {
        const domain = await prisma.domain.findUnique({ where: { url: domainKey } });
        if (!domain) continue;

        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const data = await fetchGscQueries(domainKey, 1);

        for (const row of data.rows) {
          await prisma.gscDataPoint.upsert({
            where: { date_query_domainId: { date: new Date(yesterday), query: row.query, domainId: domain.id } },
            update: { clicks: row.clicks, impressions: row.impressions, ctr: row.ctr / 10, position: row.position },
            create: { date: new Date(yesterday), query: row.query, clicks: row.clicks, impressions: row.impressions, ctr: row.ctr / 10, position: row.position, domainId: domain.id },
          });
        }
        log.info(`GSC saved for ${domainKey}: ${data.rows.length} queries`);
      }
    } catch (error) {
      log.error('GSC cron error:', error.message);
    }
  });

  log.info('Cron jobs registered');
}
