// Run with: npm run seed  (from backend/)
// Creates placeholder categories, products, and a live weekly deal so the
// storefront has something to display immediately after deploy.
require('dotenv').config();
const { sequelize, Category, Product, Deal } = require('../src/models');

const slugify = (str) =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const CATEGORY = {
  MERCHANDISE: 'Merchandise',
  CAMPAIGNS: 'Campaigns',
  BOOKS: 'Books',
  GADGETS: 'Gadgets'
};

const CATEGORIES = [
  {
    name: CATEGORY.MERCHANDISE,
    description: 'Official Teslim Digital branded merchandise and more.'
  },
  {
    name: CATEGORY.CAMPAIGNS,
    description: 'Community outreach and sponsorship initiatives.'
  },
  {
    name: CATEGORY.BOOKS,
    description: 'Printed books, digital PDFs and eBooks.'
  },
  {
    name: CATEGORY.GADGETS,
    description: 'Phones, laptops and technology accessories.'
  }
];

const PLACEHOLDER_IMAGE = (seed) =>
  `https://placehold.co/800x800/0D9488/FDF6F0?text=${encodeURIComponent(seed)}`;


const PRODUCTS_BY_CATEGORY = {
  [CATEGORY.MERCHANDISE]: [
    {
      name: 'Teslim Digital Signature T-Shirt',
      price: 18000,
      compareAtPrice: 22000,
      isFeatured: true
    },
    {
      name: 'Teslim Digital Community Hoodie',
      price: 35000,
      compareAtPrice: 40000,
      isFeatured: true
    },
    {
      name: 'Teslim Digital Embroidered Cap',
      price: 12000,
      compareAtPrice: null,
      isFeatured: false
    },
    {
      name: 'Teslim Digital Winter Beanie',
      price: 10000,
      compareAtPrice: null,
      isFeatured: false
    }
  ],

  [CATEGORY.CAMPAIGNS]: [
    {
      name: 'Sponsor-a-Blanket',
      price: 5000,
      compareAtPrice: null,
      isFeatured: true
    },
    {
      name: 'Sponsor Five Blankets',
      price: 25000,
      compareAtPrice: null,
      isFeatured: false
    }
  ],

  [CATEGORY.BOOKS]: [
    {
      name: 'Leadership Principles (Printed)',
      price: 12000,
      compareAtPrice: 15000,
      isFeatured: true
    },
    {
      name: 'Leadership Principles (PDF)',
      price: 5000,
      compareAtPrice: null,
      isFeatured: false
    },
    {
      name: 'Faith & Purpose (eBook)',
      price: 6500,
      compareAtPrice: null,
      isFeatured: true
    }
  ],

  [CATEGORY.GADGETS]: [
    {
      name: 'Apple iPhone',
      price: 1450000,
      compareAtPrice: 1500000,
      isFeatured: true
    },
    {
      name: 'Samsung Galaxy',
      price: 1250000,
      compareAtPrice: null,
      isFeatured: true
    },
    {
      name: 'Google Pixel',
      price: 980000,
      compareAtPrice: null,
      isFeatured: false
    },
    {
      name: 'TCL Flip Phone',
      price: 150000,
      compareAtPrice: null,
      isFeatured: false
    },
    {
      name: 'MacBook Air',
      price: 2100000,
      compareAtPrice: null,
      isFeatured: true
    },
    {
      name: 'USB-C Fast Charger',
      price: 18000,
      compareAtPrice: null,
      isFeatured: false
    },
    {
      name: 'Laptop Backpack',
      price: 28000,
      compareAtPrice: null,
      isFeatured: false
    }
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
    where: { title: "This Week's Featured Collection" },
    defaults: {
      title: "This Week's Featured Collection",
      description: 'Discover this week’s featured products and community initiatives from Teslim Digital.',
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
