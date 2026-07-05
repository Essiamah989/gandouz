const fs = require('fs');

const parsedData = require('./parsed.json');
const mockDbPath = './src/lib/mock_db.json';
const mockDb = require(mockDbPath);

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// 1. Process Categories
const uniqueFamilies = [...new Set(parsedData.map(item => item['Famille']))].filter(Boolean);

uniqueFamilies.forEach(family => {
  const familySlug = slugify(family);
  const existingCat = mockDb.categories.find(c => c.slug === familySlug);
  
  if (!existingCat) {
    mockDb.categories.push({
      id: `cat-${familySlug}`,
      name: family,
      slug: familySlug,
      description: `Category for ${family}`,
      image: null,
      parentId: null,
      createdAt: new Date().toISOString()
    });
  }
});

// 2. Process Products
parsedData.forEach((item, index) => {
  const name = item['Désignation'];
  const family = item['Famille'];
  const price = item['PventeTTC'];
  
  if (!name || !family) return;
  
  const slug = slugify(name) + '-' + index;
  const categorySlug = slugify(family);
  const category = mockDb.categories.find(c => c.slug === categorySlug);
  
  if (!category) return;
  
  const newProduct = {
    id: `prod-${slug}`,
    name: name,
    slug: slug,
    description: name,
    images: [],
    categoryId: category.id,
    brandId: null,
    basePrice: Number(price) || 0,
    salePrice: null,
    isFeatured: false,
    isActive: true,
    loyaltyPoints: Math.floor(Number(price) || 0),
    tags: [categorySlug],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    variants: [
      {
        id: `var-${slug}-default`,
        productId: `prod-${slug}`,
        size: "Standard",
        price: Number(price) || 0,
        salePrice: null,
        stock: 100,
        sku: `SKU-${slug.substring(0, 10).toUpperCase()}-${index}`
      }
    ]
  };
  
  mockDb.products.push(newProduct);
});

fs.writeFileSync(mockDbPath, JSON.stringify(mockDb, null, 2));
console.log('Successfully added products to mock_db.json');
