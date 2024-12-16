
import express from 'express';
import { getAllEvents, getEventById } from '../controllers/event.controller.js';
import { signUpForEvent } from '../controllers/signup.controller.js';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { addToGoogleCalendar } from '../controllers/calendar.controller.js';

const router = express.Router();

router.get('/events', getAllEvents);
router.get('/events/:id', getEventById);
router.post('/events/signup', authenticateToken, signUpForEvent);
router.post('/events/:eventId/add-to-google-calendar', authenticateToken, addToGoogleCalendar);

export default router;