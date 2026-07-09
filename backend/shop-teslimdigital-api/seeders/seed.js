// Run with: npm run seed  (from backend/)
// Creates placeholder categories, products, and a live weekly deal so the
// storefront has something to display immediately after deploy.
require('dotenv').config();
const { sequelize, Category, Product, Deal } = require('../models');

const slugify = (str) =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const CATEGORIES = [
  { name: 'Phones & Tablets', description: 'Smartphones, tablets and accessories' },
  { name: 'Laptops & Computers', description: 'Laptops, desktops and peripherals' },
  { name: 'Audio', description: 'Headphones, earbuds and speakers' },
  { name: 'Smart Home', description: 'Smart plugs, lighting and home gadgets' },
  { name: 'Gaming', description: 'Consoles, controllers and accessories' }
];

const PLACEHOLDER_IMAGE = (seed) => `https://placehold.co/800x800/0D9488/FDF6F0?text=${encodeURIComponent(seed)}`;

const PRODUCTS_BY_CATEGORY = {
  'Phones & Tablets': [
    { name: 'Aurora X12 Smartphone', price: 285000, compareAtPrice: 320000, isFeatured: true },
    { name: 'Aurora Tab Lite 10"', price: 195000, compareAtPrice: null, isFeatured: false },
    { name: 'Nova Fold Phone', price: 610000, compareAtPrice: 675000, isFeatured: true }
  ],
  'Laptops & Computers': [
    { name: 'Zenbook Pro 14 Laptop', price: 720000, compareAtPrice: 799000, isFeatured: true },
    { name: 'CompactDesk Mini PC', price: 340000, compareAtPrice: null, isFeatured: false },
    { name: '27" UltraView Monitor', price: 210000, compareAtPrice: 245000, isFeatured: false }
  ],
  'Audio': [
    { name: 'Pulse Wireless Earbuds', price: 45000, compareAtPrice: 60000, isFeatured: true },
    { name: 'BassCloud Bluetooth Speaker', price: 68000, compareAtPrice: null, isFeatured: false },
    { name: 'StudioFit Over-Ear Headphones', price: 92000, compareAtPrice: 110000, isFeatured: false }
  ],
  'Smart Home': [
    { name: 'GlowHub Smart Bulb (4-pack)', price: 32000, compareAtPrice: null, isFeatured: false },
    { name: 'HomeGuard Smart Plug', price: 18000, compareAtPrice: 22000, isFeatured: false }
  ],
  'Gaming': [
    { name: 'Vortex Pro Controller', price: 55000, compareAtPrice: null, isFeatured: true },
    { name: 'ArcadeX Handheld Console', price: 175000, compareAtPrice: 199000, isFeatured: true }
  ]
};

async function seed() {
  await sequelize.authenticate();

  const categoryRecords = {};
  for (const cat of CATEGORIES) {
    const [record] = await Category.findOrCreate({
      where: { slug: slugify(cat.name) },
      defaults: { ...cat, slug: slugify(cat.name) }
    });
    categoryRecords[cat.name] = record;
  }

  const createdProducts = [];
  for (const [categoryName, products] of Object.entries(PRODUCTS_BY_CATEGORY)) {
    const category = categoryRecords[categoryName];
    for (const p of products) {
      const slug = slugify(p.name);
      const [product] = await Product.findOrCreate({
        where: { slug },
        defaults: {
          name: p.name,
          slug,
          description: `${p.name} — placeholder product description. Replace with real copy before launch.`,
          price: p.price,
          compareAtPrice: p.compareAtPrice,
          images: [PLACEHOLDER_IMAGE(p.name), PLACEHOLDER_IMAGE(p.name + ' 2')],
          inventory: 25,
          isFeatured: p.isFeatured,
          categoryId: category.id,
          tags: [categoryName.toLowerCase()]
        }
      });
      createdProducts.push(product);
    }
  }

  const [deal] = await Deal.findOrCreate({
    where: { title: 'Weekly Flash Sale' },
    defaults: {
      title: 'Weekly Flash Sale',
      description: 'Up to 20% off selected electronics — this week only.',
      discountPercent: 20,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  });

  const dealProducts = createdProducts.filter((p) => p.isFeatured).slice(0, 6);
  await deal.addProducts(dealProducts);

  console.log(`Seeded ${Object.keys(categoryRecords).length} categories, ${createdProducts.length} products, and 1 deal.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
