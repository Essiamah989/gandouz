const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

function generateId() {
  return crypto.randomUUID();
}

function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const filePath = path.join(__dirname, '../docs/liste des prduits.xls');
const workbook = xlsx.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

const data = xlsx.utils.sheet_to_json(worksheet);

// Existing categories mapped from Supabase
const categoryMap = {
  'UCCV': 'cmr7q8uzs0000o9zu6dah8vxa',
  'RAOUIA': 'cmr7qbn700000fcy3izbrzykp',
  'CEPTUNE': 'cmr7qbyey0001o9zuavgz0wu4',
  'DOMAINE SHADRAPA': 'cmr7qc6tr0001fcy3msnppkou',
  'PRINCE BIR DRASSEN': 'cmr7qcc0m0002o9zuqs02qwxj',
  'SICOB': 'cmr7qchno0002fcy35h9pr8z3',
  'TUNISIE COCKTAIL': 'cmr7qco5w0003o9zuxffzcbdz',
  'DOMAINE NEFERYS': 'cmr7qcvgw0004o9zuakvoovic',
  'WHISKY VODKA': 'cmr7qd1k60003fcy3g9bumhjz',
  'TERRAGLACIA': 'cmr7qef4d0004fcy300s9f4pt',
  'SOTEV': 'cmr7qemp80006o9zutx5cc31i',
  'SONOBRA': 'cmr7qeul00005fcy3kt6wwt9r',
  'SFBT': 'cmr7qf3rd0006fcy3kd8ig7dw',
  'KURUBIS': 'cmr7qfhl00007fcy3r33hbjuv',
  'BOUARGOUB': 'cmr7qg6lp0009o9zu1y12c0rn'
};

const productSql = [];
const productSlugs = new Set();

data.forEach((row) => {
  const name = row['Désignation'];
  const famille = row['Famille'];
  const price = row['PventeTTC'];

  if (!name || !famille || price === undefined) return;

  const catId = categoryMap[famille];
  if (!catId) {
    console.warn(`Category ID not found for Famille: ${famille}`);
    return;
  }

  const prodId = generateId();
  let prodSlug = slugify(name);

  // Ensure unique product slug
  let counter = 1;
  let uniqueProdSlug = prodSlug;
  while (productSlugs.has(uniqueProdSlug)) {
    uniqueProdSlug = `${prodSlug}-${counter}`;
    counter++;
  }
  productSlugs.add(uniqueProdSlug);

  productSql.push(
    `INSERT INTO "Product" (id, name, slug, "categoryId", "basePrice", images, tags, "updatedAt") VALUES ('${prodId}', '${name.replace(/'/g, "''")}', '${uniqueProdSlug}', '${catId}', ${price}, ARRAY[]::text[], ARRAY[]::text[], NOW());`
  );
});

const finalSql = [
  '-- Insert Products (Using existing Category IDs)',
  ...productSql
].join('\n');

const outputPath = path.join(__dirname, 'seed_products.sql');
fs.writeFileSync(outputPath, finalSql, 'utf-8');
console.log(`Generated SQL at ${outputPath}`);
