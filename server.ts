import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import apiRoutes from './routes/apiRoutes';
import { mockDB } from './utils/mockDb';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Load persistent data from Firestore at startup (rely on actual Firestore database if configured)
  try {
    await mockDB.loadFromFirestore();
  } catch (err) {
    console.warn("Failed to load mockDB data from Firestore at startup:", err);
  }

  // Support JSON and urlencoded request bodies
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Debug log requests in terminal
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} [${req.method}] ${req.url}`);
    next();
  });

  // Mount central API routes
  app.use('/api', apiRoutes);

  // Serve GlamBook custom uploaded lifestyle assets as static files to prevent broken images in production build
  app.use('/src/assets/images', express.static(path.join(process.cwd(), 'src/assets/images')));

  // Serve Frontend React SPA
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting development backend server with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting production backend server. Serving static files from dist...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GlamBook Server is successfully listening on port ${PORT}`);
    console.log(`Development site URL: http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Critical server bootstrap failure:", err);
  process.exit(1);
});
