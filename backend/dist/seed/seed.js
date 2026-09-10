"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
const slug_1 = require("../utils/slug");
const Category_1 = require("../models/Category");
const MenuItem_1 = require("../models/MenuItem");
const Location_1 = require("../models/Location");
const RestaurantSettings_1 = require("../models/RestaurantSettings");
const IntegrationSettings_1 = require("../models/IntegrationSettings");
const Admin_1 = require("../models/Admin");
const CATEGORIES = [
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
const LOCATIONS = [
    {
        name: "Meenu's Dosa - Main Outlet",
        address: 'Update with the verified outlet address',
        phone: '9999999999',
        openingHours: [
            { day: 'monday', open: '08:00', close: '22:00', isClosed: false },
            { day: 'tuesday', open: '08:00', close: '22:00', isClosed: false },
            { day: 'wednesday', open: '08:00', close: '22:00', isClosed: false },
            { day: 'thursday', open: '08:00', close: '22:00', isClosed: false },
            { day: 'friday', open: '08:00', close: '22:00', isClosed: false },
            { day: 'saturday', open: '08:00', close: '22:30', isClosed: false },
            { day: 'sunday', open: '08:00', close: '22:30', isClosed: false },
        ],
        mapsUrl: '',
        zomatoUrl: '',
        swiggyUrl: '',
        isActive: true,
    },
];
async function seedCategories() {
    const categoryIdByName = new Map();
    for (const cat of CATEGORIES) {
        const slug = (0, slug_1.toSlug)(cat.name);
        const doc = await Category_1.Category.findOneAndUpdate({ slug }, {
            name: cat.name,
            slug,
            image: cat.image,
            sortOrder: cat.sortOrder,
            isActive: true,
        }, { upsert: true, new: true, setDefaultsOnInsert: true });
        categoryIdByName.set(cat.name, doc._id);
    }
    return categoryIdByName;
}
async function seedMenuItems(categoryIdByName) {
    let created = 0;
    let updated = 0;
    for (const cat of CATEGORIES) {
        const categoryId = categoryIdByName.get(cat.name);
        for (let i = 0; i < cat.dishes.length; i++) {
            const dish = cat.dishes[i];
            const slug = (0, slug_1.toSlug)(dish.name);
            const existing = await MenuItem_1.MenuItem.exists({ slug });
            await MenuItem_1.MenuItem.findOneAndUpdate({ slug }, {
                name: dish.name,
                slug,
                category: categoryId,
                price: dish.price,
                sortOrder: i,
            }, { upsert: true, new: true, setDefaultsOnInsert: true });
            if (existing) {
                updated += 1;
            }
            else {
                created += 1;
            }
        }
    }
    logger_1.logger.info(`Menu items seeded: ${created} created, ${updated} already existed/updated`);
}
async function seedLocations() {
    for (const loc of LOCATIONS) {
        await Location_1.Location.findOneAndUpdate({ name: loc.name }, loc, { upsert: true, new: true, setDefaultsOnInsert: true });
    }
}
async function seedRestaurantSettings() {
    const existing = await RestaurantSettings_1.RestaurantSettings.findOne();
    if (!existing) {
        await RestaurantSettings_1.RestaurantSettings.create({
            restaurantName: "Meenu's Dosa",
            description: 'Authentic South Indian dosas, idlis, and more.',
        });
    }
}
async function seedIntegrationSettings() {
    const existing = await IntegrationSettings_1.IntegrationSettings.findOne();
    if (!existing) {
        await IntegrationSettings_1.IntegrationSettings.create({
            whatsappNumber: env_1.env.whatsapp.phoneNumber,
            zomatoUrl: env_1.env.zomatoUrl,
            swiggyUrl: env_1.env.swiggyUrl,
        });
    }
}
async function seedAdmin() {
    if (!env_1.env.seedAdminEmail || !env_1.env.seedAdminPassword) {
        logger_1.logger.warn('SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD not set — skipping default admin creation');
        return;
    }
    const existing = await Admin_1.Admin.findOne({ email: env_1.env.seedAdminEmail.toLowerCase() });
    if (existing) {
        logger_1.logger.info('Admin account already exists — skipping creation');
        return;
    }
    await Admin_1.Admin.create({
        name: env_1.env.seedAdminName,
        email: env_1.env.seedAdminEmail.toLowerCase(),
        password: env_1.env.seedAdminPassword,
        role: 'super_admin',
    });
    logger_1.logger.info('Default admin account created from environment configuration');
}
async function run() {
    await mongoose_1.default.connect(env_1.env.mongodbUri);
    logger_1.logger.info('Connected to database for seeding');
    const categoryIdByName = await seedCategories();
    await seedMenuItems(categoryIdByName);
    await seedLocations();
    await seedRestaurantSettings();
    await seedIntegrationSettings();
    await seedAdmin();
    logger_1.logger.info('Seeding complete');
    await mongoose_1.default.disconnect();
    process.exit(0);
}
run().catch((err) => {
    logger_1.logger.error(`Seeding failed: ${err.message}`);
    process.exit(1);
});
