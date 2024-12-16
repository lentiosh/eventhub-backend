import { db } from '../db/index.js';
import { categoriesTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await db.select().from(categoriesTable);
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
