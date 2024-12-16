import express from 'express';
import { createEvent, getEvents, getEventById, updateEvent, deleteEvent } from '../controllers/dashboard.controller.js';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { isStaff } from '../middleware/isStaff.js';

const router = express.Router();

router.use(authenticateToken, isStaff);

router.post('/events', createEvent);

router.get('/events', getEvents);

router.get('/events/:id', getEventById);

router.put('/events/:id', updateEvent);

router.delete('/events/:id', deleteEvent);

export default router;
