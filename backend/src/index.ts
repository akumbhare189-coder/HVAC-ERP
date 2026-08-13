import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

import customerRoutes from './routes/customerRoutes';
import enquiryRoutes from './routes/enquiryRoutes';
import projectRoutes from './routes/projectRoutes';
import godownRoutes from './routes/godownRoutes';
import inventoryRoutes from './routes/inventoryRoutes';
import technicianRoutes from './routes/technicianRoutes';
import serviceCallRoutes from './routes/serviceCallRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API Endpoints
app.use('/api/customers', customerRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/godowns', godownRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/technicians', technicianRoutes);
app.use('/api/service-calls', serviceCallRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend static build if available
const candidateRoots = [
  process.cwd(),
  path.resolve(process.cwd(), '..'),
  path.resolve(__dirname, '..', '..'),
  path.resolve(__dirname, '..', '..', '..'),
];
const projectRoot = candidateRoots.find((root) =>
  fs.existsSync(path.join(root, 'frontend')) || fs.existsSync(path.join(root, 'backend'))
) || process.cwd();

const possibleStaticPaths = [
  path.join(projectRoot, 'frontend', 'public'),
  path.join(projectRoot, 'frontend', 'dist'),
  path.join(projectRoot, 'public'),
  path.join(projectRoot, 'dist'),
  path.join(process.cwd(), 'public'),
  path.join(process.cwd(), 'dist'),
];

const frontendDistPath = possibleStaticPaths.find((p) => fs.existsSync(path.join(p, 'index.html')));

if (frontendDistPath) {
  console.log(`Serving frontend static files from: ${frontendDistPath}`);
  app.use(express.static(frontendDistPath));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Live HVAC ERP server listening on 0.0.0.0:${PORT}`);
});

export default app;