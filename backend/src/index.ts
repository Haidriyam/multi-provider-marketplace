import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { config } from './config';
import { errorHandler } from './middleware/errorHandler';

// Module Routes
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import providersRoutes from './modules/providers/providers.routes';
import listingsRoutes from './modules/listings/listings.routes';
import destinationsRoutes from './modules/destinations/destinations.routes';
import categoriesRoutes from './modules/categories/categories.routes';
import bookingsRoutes from './modules/bookings/bookings.routes';
import reviewsRoutes from './modules/reviews/reviews.routes';
import adminRoutes from './modules/admin/admin.routes';
import contentRoutes from './modules/content/content.routes';
import { openApiSpec, swaggerUiHtml } from './docs/openapi';

const app = express();

// Security & Utility Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allows Swagger UI cdn styles
}));
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (config.environment !== 'test') {
  app.use(morgan('dev'));
}

// Rate Limiting (OWASP recommendation)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' }
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

// OpenAPI Documentation
app.get('/api/docs/json', (req: Request, res: Response) => {
  res.json(openApiSpec);
});
app.get('/api/docs', (req: Request, res: Response) => {
  res.send(swaggerUiHtml);
});

// Modular Routes Registration
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/providers', providersRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/destinations', destinationsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/content', contentRoutes);

// Fallback 404
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global Error Handler
app.use(errorHandler);

const PORT = config.port;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`🚀 Multi-Provider Marketplace API running on port ${PORT}`);
    console.log(`📖 API Documentation available at: http://localhost:${PORT}/api/docs`);
    console.log(`🏥 Health check endpoint at: http://localhost:${PORT}/health`);
    console.log(`===================================================`);
  });
}

export default app;
