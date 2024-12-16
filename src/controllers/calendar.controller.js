import { db } from "../db/index.js";
import { usersTable, eventsTable } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { google } from 'googleapis';

export const addToGoogleCalendar = async (req, res, next) => {
  try {
    
    const userId = req.user.id;

    const eventId = req.params.eventId;
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (!user || !user.google_access_token) {
      
      return res.status(400).json({ message: "Google account not linked. Please log in with Google." });
    }

    if (!user.google_refresh_token) {
      
      return res.status(400).json({ 
        message: "Your Google permissions need to be refreshed. Please log in with Google again." 
      });
    }

    
    const [event] = await db
      .select()
      .from(eventsTable)
      .where(eq(eventsTable.id, eventId))
      .limit(1);

    if (!event) {
      
      return res.status(404).json({ message: "Event not found." });
    }

    const eventDate = new Date(event.date);
    if (isNaN(eventDate.getTime())) {
      
      return res.status(400).json({ message: "Invalid event date." });
    }

    
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALLBACK_URL
    );

    oauth2Client.setCredentials({ 
      access_token: user.google_access_token,
      refresh_token: user.google_refresh_token 
    });

    
    const newToken = await oauth2Client.getAccessToken();
    
    if (newToken && newToken.token && newToken.token !== user.google_access_token) {
      
      const [updatedUser] = await db
        .update(usersTable)
        .set({ google_access_token: newToken.token })
        .where(eq(usersTable.id, userId))
        .returning({
          id: usersTable.id,
          email: usersTable.email,
          google_access_token: usersTable.google_access_token,
        });
      
    }

    
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const startDateTime = eventDate.toISOString();
    const endDateTime = new Date(eventDate.getTime() + 3600000).toISOString(); // +1 hour

    const calendarEvent = {
      summary: event.title,
      description: event.description || "",
      location: event.location || "",
      start: { dateTime: startDateTime },
      end: { dateTime: endDateTime },
      attendees: [],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 10 },
        ],
      },
    };

   

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: calendarEvent,
    });


    return res.status(200).json({ 
      message: "Event added to your Google Calendar.", 
      eventLink: response.data.htmlLink 
    });
  } catch (error) {
    
    if (error.response && error.response.data) {
      
    }
    return res.status(500).json({ message: "Internal Server Error" });
  } finally {
    
    next && next();
  }
};
