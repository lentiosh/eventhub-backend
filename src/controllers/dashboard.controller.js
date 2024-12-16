import { db } from '../db/index.js';
import { eventsTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const createEvent = async (req, res, next) => {
  try {
    const { title, description, date, location, img } = req.body;
    const created_by = req.user.id;

    if (!title || !date) {
      return res.status(400).json({ message: "Title and date are required." });
    }

    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format." });
    }

    const [newEvent] = await db
      .insert(eventsTable)
      .values({
        title,
        description,
        date: eventDate, 
        location,
        img,
        created_by,
      })
      .returning();

    res.status(201).json({ message: "Event created successfully.", event: newEvent });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const getEvents = async (req, res, next) => {
  try {
    const events = await db.select().from(eventsTable);
    res.status(200).json({ events });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
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
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    let { title, description, date, location, img } = req.body;

    const [existingEvent] = await db
      .select()
      .from(eventsTable)
      .where(eq(eventsTable.id, id))
      .limit(1);

    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found." });
    }

    let eventDate;
    if (date !== undefined) {
      eventDate = new Date(date);
      if (isNaN(eventDate.getTime())) {
        return res.status(400).json({ message: "Invalid date format." });
      }
    }

    const [updatedEvent] = await db
      .update(eventsTable)
      .set({
        title: title !== undefined ? title : existingEvent.title,
        description: description !== undefined ? description : existingEvent.description,
        date: eventDate !== undefined ? eventDate : existingEvent.date,
        location: location !== undefined ? location : existingEvent.location,
        img: img !== undefined ? img : existingEvent.img,
        updated_at: new Date(),
      })
      .where(eq(eventsTable.id, id))
      .returning(); 

    res.status(200).json({ message: "Event updated successfully.", event: updatedEvent });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [existingEvent] = await db
      .select()
      .from(eventsTable)
      .where(eq(eventsTable.id, id))
      .limit(1);

    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found." });
    }

    await db
      .delete(eventsTable)
      .where(eq(eventsTable.id, id));

    res.status(200).json({ message: "Event deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
