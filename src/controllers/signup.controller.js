import { db } from "../db/index.js";
import { eventSignupsTable, eventsTable } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const signUpForEvent = async (req, res, next) => {
  try {
    const { eventId } = req.body;
    const userId = req.user.id; 

    // check the event exists
    const eventExists = await db
      .select()
      .from(eventsTable)
      .where(eq(eventsTable.id, eventId))
      .limit(1);

    if (eventExists.length === 0) {
      return res.status(404).json({ message: "Event not found." });
    }

    const existingSignup = await db
      .select()
      .from(eventSignupsTable)
      .where(eq(eventSignupsTable.event_id, eventId))
      .where(eq(eventSignupsTable.user_id, userId))
      .limit(1);

    if (existingSignup.length > 0) {
      return res.status(400).json({ message: "User already signed up for this event." });
    }

    await db.insert(eventSignupsTable).values({
      user_id: userId,
      event_id: eventId,
    });

    return res.status(201).json({ message: "Successfully signed up for the event." });
  } catch (error) {
    next(error);
  }
};