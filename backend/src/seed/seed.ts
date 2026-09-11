import dotenv from 'dotenv';
import path from 'path';

// Force load .env from root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import mongoose from 'mongoose';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { toSlug } from '../utils/slug';
import { Category } from '../models/category';
import { MenuItem } from '../models/menuitem';
import { Location } from '../models/location';
import { RestaurantSettings } from '../models/restaurantsettings';
import { IntegrationSettings } from '../models/integrationsettings';
import { Admin } from '../models/admin';

interface SeedDish {
  name: string;
  price: number;
}

const CATEGORIES: { name: string; image: string; sortOrder: number; dishes: SeedDish[] }[] = [
  {
    name: 'Dosas',
    image: 'dosa.jpg',
    sortOrder: 1,
    dishes: [
      { name: 'Butter Masala Dosa', price: 209 },
      { name: 'Butter Plain Dosa', price: 189 },
      { name: 'Cheese Masala Dosa', price: 293 },
      { name: 'Cheese Plain Dosa', price: 278 },
      { name: 'Masala Dosa', price: 195 },
      { name: 'Plain Dosa', price: 172 },
      { name: 'Garlic Roast Plain Dosa', price: 285 },
      { name: 'Ghee Roast Masala Dosa', price: 293 },
      { name: 'Ghee Roast Plain Dosa', price: 274 },
      { name: 'Mysore Masala Dosa', price: 213 },
      { name: 'Mysore Plain Dosa', price: 196 },
      { name: 'Onion Dosa', price: 196 },
      { name: 'Paneer Masala Dosa', price: 253 },
      { name: 'Paneer Plain Dosa', price: 228 },
      { name: 'Plain Set Dosa', price: 204 },
      { name: 'Podi Seeragam Set Dosa', price: 221 },
      { name: 'Rawa Masala Dosa', price: 264 },
      { name: 'Plain Rawa Dosa', price: 238 },
    ],
  },
  {
    name: 'Idli / Vada / Upma',
    image: 'idli.jpg',
    sortOrder: 2,
    dishes: [
      { name: 'Button Idli Fry', price: 163 },
      { name: 'Ghee Podi Thaat Idli', price: 199 },
      { name: 'Ghee Veggie Rawa Upma', price: 221 },
      { name: 'Idli Sambar', price: 149 },
      { name: 'Idli Vada Sambar', price: 159 },
      { name: 'Molapodi Idli', price: 163 },
      { name: 'Vada Sambar', price: 166 },
      { name: 'Veggie Rawa Upma', price: 199 },
      { name: 'Rasam Idli', price: 162 },
    ],
  },
  {
    name: 'South Indian Rice',
    image: 'rice.jpg',
    sortOrder: 3,
    dishes: [
      { name: 'Curd Rice', price: 249 },
      { name: 'Lemon Rice', price: 229 },
      { name: 'Rasam Rice', price: 229 },
      { name: 'Sambar Rice', price: 229 },
      { name: 'Tamarind Rice', price: 229 },
      { name: 'Tomato Rice', price: 229 },
    ],
  },
  {
    name: 'Uttapam',
    image: 'uttapam.jpg',
    sortOrder: 4,
    dishes: [
      { name: 'Cheese Uttapam', price: 289 },
      { name: 'Onion Uttapam', price: 221 },
      { name: 'Paneer Uttapam', price: 279 },
      { name: 'Regular Uttapam', price: 225 },
      { name: 'Tomato Uttapam', price: 225 },
      { name: 'Mixed Vegetable Uttapam', price: 230 },
    ],
  },
  {
    name: 'Exclusives',
    image: 'exclusives.jpg',
    sortOrder: 5,
    dishes: [
      { name: 'Idiyappam', price: 211 },
      { name: 'Idiyappam With Coconut Milk', price: 254 },
    ],
  },
  {
    name: 'Desserts',
    image: 'desserts.jpg',
    sortOrder: 6,
    dishes: [
      { name: 'Paysam', price: 134 },
      { name: 'Dadi Ka Halwa', price: 162 },
      { name: 'Kesari Halwa', price: 119 },
      { name: 'Pinapple Sheera', price: 128 },
    ],
  },
  {
    name: 'Cold Beverages',
    image: 'beverages.jpg',
    sortOrder: 7,
    dishes: [
      { name: 'Butterscotch Shake', price: 229 },
      { name: 'Monin Chocolate Shake', price: 264 },
      { name: 'Davidoff Cold Coffee', price: 190 },
      { name: 'Oreo Shake', price: 209 },
      { name: 'Swadeshi Buttermilk', price: 99 },
      { name: 'Hazelnut Cold Coffee', price: 219 },
      { name: 'Vanilla Shake', price: 199 },
      { name: 'Sangam Lassi', price: 149 },
    ],
  },
  {
    name: 'Mocktails / Sodas',
    image: 'mocktails.jpg',
    sortOrder: 8,
    dishes: [
      { name: 'Lemon Iced Tea', price: 149 },
    ],
  },
];

const LOCATIONS: {
  name: string;
  address: string;
  phone: string;
  hours: string;
  openingHours: {
    day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    open: string;
    close: string;
    isClosed: boolean;
  }[];
  mapsUrl: string;
  zomatoUrl: string;
  swiggyUrl: string;
  isActive: boolean;
}[] = [
  {
    name: "Meenu's Dosa — Minal Residency",
    address: 'Shop No. 21 & 22, Ground Floor, Raj Capital, Minaal Residency, J.K. Road, Ayodhya Bypass, Bhopal, Madhya Pradesh – 462023',
    phone: '+91 6262 9555 05',
    hours: '8:00 AM – 10:30 PM',
    openingHours: [
      ...(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const).map((day) => ({ day, open: '08:00', close: '22:30', isClosed: false })),
    ],
    mapsUrl: 'https://www.google.com/maps/place/Meenu%27s+Dosa+-+Minal+Residency',
    zomatoUrl: 'https://www.zomato.com/bhopal/meenus-dosa-ayodhya-bypass/',
    swiggyUrl: 'https://www.swiggy.com/city/bhopal/meenus-dosa-minal-minaal-residency-piplani-rest995939',
    isActive: true,
  },
  {
    name: "Meenu's Dosa — MP Nagar",
    address: 'Shop No. 1, Plot No. 130, Zone 2, Maharana Pratap Nagar, Bhopal, Madhya Pradesh – 462011',
    phone: '+91 6262 9555 06',
    hours: '8:00 AM – 10:30 PM',
    openingHours: [
      ...(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const).map((day) => ({ day, open: '08:00', close: '22:30', isClosed: false })),
    ],
    mapsUrl: 'https://www.google.com/maps/place/Meenu%27s+Dosa+-+MP+Nagar',
    zomatoUrl: 'https://www.zomato.com/bhopal/meenus-dosa-maharana-pratap-nagar/',
    swiggyUrl: 'https://www.swiggy.com/restaurants/bhopal/maharana-pratap-nagar/meenu-s-dosa-812869/dineout',
    isActive: true,
  },
];

async function seedCategories() {
  const categoryIdByName = new Map<string, mongoose.Types.ObjectId>();

  for (const cat of CATEGORIES) {
    const slug = toSlug(cat.name);
    const doc = await Category.findOneAndUpdate(
      { slug },
      {
        name: cat.name,
        slug,
        image: cat.image,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    categoryIdByName.set(cat.name, doc._id as mongoose.Types.ObjectId);
  }

  return categoryIdByName;
}

async function seedMenuItems(categoryIdByName: Map<string, mongoose.Types.ObjectId>) {
  let created = 0;
  let updated = 0;

  for (const cat of CATEGORIES) {
    const categoryId = categoryIdByName.get(cat.name);
    for (let i = 0; i < cat.dishes.length; i++) {
      const dish = cat.dishes[i];
      const slug = toSlug(dish.name);
      const existing = await MenuItem.exists({ slug });
      await MenuItem.findOneAndUpdate(
        { slug },
        {
          name: dish.name,
          slug,
          category: categoryId,
          price: dish.price,
          sortOrder: i,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      if (existing) {
        updated += 1;
      } else {
        created += 1;
      }
    }
  }

  logger.info(`Menu items seeded: ${created} created, ${updated} already existed/updated`);
}

async function seedLocations() {
  await Location.deleteOne({ name: "Meenu's Dosa - Main Outlet" });

  for (const loc of LOCATIONS) {
    await Location.findOneAndUpdate(
      { name: loc.name },
      loc,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
}

async function seedRestaurantSettings() {
  const existing = await RestaurantSettings.findOne();
  if (!existing) {
    await RestaurantSettings.create({
      restaurantName: "Meenu's Dosa",
      description: 'Authentic South Indian dosas, idlis, and more.',
    });
  }
}

async function seedIntegrationSettings() {
  const existing = await IntegrationSettings.findOne();
  if (!existing) {
    await IntegrationSettings.create({
      whatsappNumber: env.whatsapp.phoneNumber,
      zomatoUrl: env.zomatoUrl,
      swiggyUrl: env.swiggyUrl,
    });
  }
}

async function seedAdmin() {
  if (!env.seedAdminEmail || !env.seedAdminPassword) {
    logger.warn('SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD not set — skipping default admin creation');
    return;
  }

  const existing = await Admin.findOne({ email: env.seedAdminEmail.toLowerCase() });
  if (existing) {
    logger.info('Admin account already exists — skipping creation');
    return;
  }

  await Admin.create({
    name: env.seedAdminName,
    email: env.seedAdminEmail.toLowerCase(),
    password: env.seedAdminPassword,
    role: 'super_admin',
  });
  logger.info('Default admin account created from environment configuration');
}

async function run() {
  await mongoose.connect(env.mongodbUri);
  logger.info('Connected to database for seeding');

  const categoryIdByName = await seedCategories();
  await seedMenuItems(categoryIdByName);
  await seedLocations();
  await seedRestaurantSettings();
  await seedIntegrationSettings();
  await seedAdmin();

  logger.info('Seeding complete');
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  logger.error(`Seeding failed: ${err.message}`);
  process.exit(1);
});
