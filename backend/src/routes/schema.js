import { Router } from 'express';
import { log } from '../services/logger.js';
import * as ai from '../services/openai.js';

const router = Router();

// ── Business Base Data ──
const SH_BUSINESS = {
  name: 'Schreinerhelden GmbH & Co. KG',
  legalName: 'Schreinerhelden GmbH & Co. KG',
  url: 'https://schreinerhelden.de',
  logo: 'https://schreinerhelden.de/wp-content/uploads/schreinerhelden-logo.png',
  image: 'https://schreinerhelden.de/wp-content/uploads/schreinerhelden-werkstatt.jpg',
  telephone: '+4971929789012',
  email: 'info@schreinerhelden.de',
  description: 'Premium-Schreinerei in Murrhardt bei Stuttgart. Maßmöbel, Einbauschränke, Küchen und Innenausbau — gefertigt in der eigenen Werkstatt.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Lindenstraße 9-15',
    addressLocality: 'Murrhardt',
    addressRegion: 'Baden-Württemberg',
    postalCode: '71540',
    addressCountry: 'DE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 48.9803,
    longitude: 9.5789,
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '07:30', closes: '17:00' },
  ],
  priceRange: '€€€',
  areaServed: [
    { '@type': 'City', name: 'Stuttgart' },
    { '@type': 'City', name: 'Murrhardt' },
    { '@type': 'City', name: 'Backnang' },
    { '@type': 'City', name: 'Waiblingen' },
    { '@type': 'City', name: 'Ludwigsburg' },
    { '@type': 'City', name: 'Schwäbisch Hall' },
    { '@type': 'City', name: 'Heilbronn' },
  ],
  sameAs: [
    'https://www.instagram.com/schreinerhelden/',
    'https://www.pinterest.de/schreinerhelden/',
    'https://g.co/kgs/schreinerhelden',
  ],
};

const IMS_BUSINESS = {
  ...SH_BUSINESS,
  name: 'Ihr Möbel-Schreiner Murrhardt',
  url: 'https://ihr-moebel-schreiner.de',
  description: 'Schreinerei für Architekten, Bauträger und Gewerbe in Murrhardt. Objektmöbel, Innenausbau und Sonderlösungen aus der eigenen Werkstatt.',
};

// ── Schema Type Generators ──

function localBusinessSchema(business) {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'HomeAndConstructionBusiness'],
    '@id': `${business.url}/#organization`,
    name: business.name,
    legalName: business.legalName,
    url: business.url,
    logo: { '@type': 'ImageObject', url: business.logo },
    image: business.image,
    telephone: business.telephone,
    email: business.email,
    description: business.description,
    address: business.address,
    geo: business.geo,
    openingHoursSpecification: business.openingHoursSpecification,
    priceRange: business.priceRange,
    areaServed: business.areaServed,
    sameAs: business.sameAs,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Schreinerei-Leistungen',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Einbauschränke nach Maß' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Küchen nach Maß' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Begehbare Kleiderschränke' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Dachschrägen-Möbel' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Innenausbau' } },
      ],
    },
  };
}

function serviceSchema(keyword, service, region, business) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${business.url}/${slugify(keyword)}/#service`,
    name: service || keyword,
    description: `${service || keyword} von ${business.name} in ${region}. Individuelle Maßfertigung aus der eigenen Werkstatt in Murrhardt.`,
    provider: {
      '@type': 'LocalBusiness',
      '@id': `${business.url}/#organization`,
      name: business.name,
    },
    areaServed: {
      '@type': 'City',
      name: region,
    },
    serviceType: keyword,
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${business.url}/termin`,
      servicePhone: business.telephone,
    },
  };
}

function faqSchema(questions) {
  if (!questions || questions.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
}

function articleSchema(title, keyword, region, wordCount, business) {
  const now = new Date().toISOString();
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: `${keyword} — Ratgeber von ${business.name}. Alles zu Kosten, Material und Planung für ${region}.`,
    author: {
      '@type': 'Organization',
      '@id': `${business.url}/#organization`,
      name: business.name,
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${business.url}/#organization`,
      name: business.name,
      logo: { '@type': 'ImageObject', url: business.logo },
    },
    datePublished: now,
    dateModified: now,
    wordCount: wordCount || 1500,
    about: {
      '@type': 'Thing',
      name: keyword,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${business.url}/${slugify(keyword)}/`,
    },
  };
}

function breadcrumbSchema(keyword, region, business) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Start', item: business.url },
      { '@type': 'ListItem', position: 2, name: keyword, item: `${business.url}/${slugify(keyword)}/` },
    ],
  };
}

function productSchema(keyword, region, priceMin, priceMax, business) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${keyword} von ${business.name}`,
    description: `${keyword} — individuell gefertigt in Murrhardt für ${region}. Maßarbeit aus der Schreinerei.`,
    brand: { '@type': 'Brand', name: business.name },
    manufacturer: {
      '@type': 'Organization',
      '@id': `${business.url}/#organization`,
      name: business.name,
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'EUR',
      lowPrice: priceMin || 2500,
      highPrice: priceMax || 15000,
      offerCount: 1,
      availability: 'https://schema.org/MadeToOrder',
      seller: {
        '@type': 'LocalBusiness',
        '@id': `${business.url}/#organization`,
      },
    },
  };
}

function slugify(text) {
  return text.toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ═══════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════

// ── Generate schema bundle for a keyword ──
router.post('/generate', async (req, res) => {
  try {
    const {
      keyword,
      region = 'Stuttgart',
      service,
      domain = 'sh',
      types = ['localBusiness', 'service', 'faq', 'breadcrumb'],
      faqQuestions,
      articleTitle,
      wordCount,
      priceMin,
      priceMax,
    } = req.body;

    if (!keyword) return res.status(400).json({ error: 'Keyword required' });

    const biz = domain === 'ims' ? IMS_BUSINESS : SH_BUSINESS;
    const schemas = {};

    for (const type of types) {
      switch (type) {
        case 'localBusiness':
          schemas.localBusiness = localBusinessSchema(biz);
          break;
        case 'service':
          schemas.service = serviceSchema(keyword, service, region, biz);
          break;
        case 'faq':
          // If no questions provided, generate with AI
          if (faqQuestions && faqQuestions.length > 0) {
            schemas.faq = faqSchema(faqQuestions);
          } else {
            try {
              const aeoResult = await ai.generateAeoQuestions(keyword);
              const qs = (aeoResult.questions || []).slice(0, 6).map(q => ({
                question: q.question,
                answer: q.answer,
              }));
              schemas.faq = faqSchema(qs);
              schemas._generatedQuestions = qs; // Return them so user can see/edit
            } catch (e) {
              log.warn('FAQ generation failed:', e.message);
              schemas.faq = null;
              schemas._faqError = e.message;
            }
          }
          break;
        case 'article':
          schemas.article = articleSchema(articleTitle || keyword, keyword, region, wordCount, biz);
          break;
        case 'breadcrumb':
          schemas.breadcrumb = breadcrumbSchema(keyword, region, biz);
          break;
        case 'product':
          schemas.product = productSchema(keyword, region, priceMin, priceMax, biz);
          break;
      }
    }

    // Build combined HTML snippet
    const htmlSnippets = Object.entries(schemas)
      .filter(([k, v]) => v && !k.startsWith('_'))
      .map(([k, v]) => `<!-- Schema: ${k} -->\n<script type="application/ld+json">\n${JSON.stringify(v, null, 2)}\n</script>`)
      .join('\n\n');

    res.json({
      keyword,
      region,
      domain,
      schemas,
      html: htmlSnippets,
      schemaCount: Object.keys(schemas).filter(k => schemas[k] && !k.startsWith('_')).length,
    });
  } catch (error) {
    log.error('Schema generation error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ── Validate JSON-LD (basic) ──
router.post('/validate', async (req, res) => {
  try {
    const { jsonld } = req.body;
    if (!jsonld) return res.status(400).json({ error: 'JSON-LD required' });

    const errors = [];
    const warnings = [];

    let parsed;
    try {
      parsed = typeof jsonld === 'string' ? JSON.parse(jsonld) : jsonld;
    } catch {
      return res.json({ valid: false, errors: ['Ungültiges JSON'], warnings: [] });
    }

    // Basic checks
    if (!parsed['@context']) errors.push('@context fehlt');
    if (!parsed['@type']) errors.push('@type fehlt');
    if (parsed['@context'] && parsed['@context'] !== 'https://schema.org') {
      warnings.push(`@context sollte "https://schema.org" sein, ist: "${parsed['@context']}"`);
    }

    // Type-specific checks
    const type = parsed['@type'];
    if (type === 'FAQPage') {
      if (!parsed.mainEntity || parsed.mainEntity.length === 0) {
        errors.push('FAQPage: mainEntity fehlt oder ist leer');
      } else {
        parsed.mainEntity.forEach((q, i) => {
          if (!q.name) errors.push(`FAQ #${i + 1}: name (Frage) fehlt`);
          if (!q.acceptedAnswer?.text) errors.push(`FAQ #${i + 1}: acceptedAnswer.text (Antwort) fehlt`);
        });
      }
    }

    if (type === 'LocalBusiness' || (Array.isArray(type) && type.includes('LocalBusiness'))) {
      if (!parsed.name) errors.push('LocalBusiness: name fehlt');
      if (!parsed.address) errors.push('LocalBusiness: address fehlt');
      if (!parsed.telephone) warnings.push('LocalBusiness: telephone empfohlen');
      if (!parsed.geo) warnings.push('LocalBusiness: geo (Koordinaten) empfohlen');
    }

    if (type === 'Service') {
      if (!parsed.name) errors.push('Service: name fehlt');
      if (!parsed.provider) warnings.push('Service: provider empfohlen');
    }

    if (type === 'Article') {
      if (!parsed.headline) errors.push('Article: headline fehlt');
      if (!parsed.author) warnings.push('Article: author empfohlen');
      if (!parsed.datePublished) warnings.push('Article: datePublished empfohlen');
    }

    res.json({
      valid: errors.length === 0,
      errors,
      warnings,
      type: Array.isArray(type) ? type.join(', ') : type,
    });
  } catch (error) {
    log.error('Schema validation error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
