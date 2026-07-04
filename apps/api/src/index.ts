import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { config } from './config';
import authRoutes from './routes/auth';
import coursesRoutes from './routes/courses';
import opportunitiesRoutes from './routes/opportunities';
import newsRoutes from './routes/news';
import servicesRoutes from './routes/services';
import resourcesRoutes from './routes/resources';
import subscribersRoutes from './routes/subscribers';
import adminRoutes from './routes/admin';
import categoriesRoutes from './routes/categories';
import uploadsRoutes from './routes/uploads';
import classesRoutes from './routes/classes';
import testimonialsRoutes from './routes/testimonials';
import partnersRoutes from './routes/partners';
import path from 'path';
import trainersRoutes from './routes/trainers';
import candidatesRoutes from './routes/candidates';
import sessionsRoutes from './routes/sessions';
import applicationsRoutes from './routes/applications';
import attendanceRoutes from './routes/attendance';
import advertisementsRoutes from './routes/advertisements';
import enrollmentsRoutes from './routes/enrollments';
import reportsRoutes from './routes/reports';
import statsRoutes from './routes/stats';
import contactRoutes from './routes/contact';
import notificationsRoutes from './routes/notifications';

const app = express();

app.use(helmet());
app.use(cors({ 
  origin: ['http://localhost:5173', 'http://localhost:5000', 'https://niroflixx.vercel.app'], 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(process.cwd(), 'storage', 'uploads')));

app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/courses', coursesRoutes);
app.use('/api/v1/opportunities', opportunitiesRoutes);
app.use('/api/v1/news', newsRoutes);
app.use('/api/v1/services', servicesRoutes);
app.use('/api/v1/resources', resourcesRoutes);
app.use('/api/v1/subscribers', subscribersRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/categories', categoriesRoutes);
app.use('/api/v1/uploads', uploadsRoutes);
app.use('/api/v1/classes', classesRoutes);
app.use('/api/v1/testimonials', testimonialsRoutes);
app.use('/api/v1/partners', partnersRoutes);
app.use('/api/v1/trainers', trainersRoutes);
app.use('/api/v1/candidates', candidatesRoutes);
app.use('/api/v1/sessions', sessionsRoutes);
app.use('/api/v1/applications', applicationsRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/advertisements', advertisementsRoutes);
app.use('/api/v1/enrollments', enrollmentsRoutes);
app.use('/api/v1/reports', reportsRoutes);
app.use('/api/v1/stats', statsRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/notifications', notificationsRoutes);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ status: 'error', message: err.message || 'Internal Server Error', code: err.status || 500 });
});

app.listen(config.port, () => {
  console.log('Niroflixx API running on port ' + config.port);
});

export default app;