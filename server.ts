import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // JSON parser with sufficient limit for base64 image data
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'HappyFox Connector Logo Generator',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  });

  // API Generate endpoint documentation / info
  app.post('/api/generate', (req, res) => {
    res.json({
      message: 'HappyFox Logo Generation API ready. Use the web interface or client-side processing pipeline.',
      spec: {
        large: {
          viewport: '150x150',
          safeArea: '112x112',
          outerInset: '19px'
        },
        small: {
          viewport: '56x56',
          safeArea: '48x48',
          outerInset: '4px'
        }
      }
    });
  });

  // Vite development middleware or static production serve
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HappyFox Connector Logo Generator running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
