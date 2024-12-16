import { db } from '../db/index.js';
import { eventsTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const getAllEvents = async (req, res, next) => {
  try {
    const events = await db.select().from(eventsTable);
    res.status(200).json({ events });
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [event] = await db
      .select()
      .from(eventsTable)
      .where(eq(eventsTable.id, id))
      .limit(1);

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.status(200).json({ event });
  } catch (error) {
    next(error);
  }
};
