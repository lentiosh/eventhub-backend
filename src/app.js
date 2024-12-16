import express from 'express';
import dotenv from 'dotenv';
import passport from './utils/passport.js';
import { helmetMiddleware, corsMiddleware } from './middleware/security.middleware.js';
import authRoutes from './routes/auth.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import eventRoutes from './routes/event.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Middleware
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

// Routes
app.use('/auth', authRoutes); 
app.use('/api/dashboard', dashboardRoutes); 
app.use('/api', eventRoutes); 

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
