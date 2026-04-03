import express from "express";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// 1. Supabase Proxy FIRST (before body parsers like express.json())
// This ensures that the request body stream is NOT consumed before proxying.
app.use('/supabase-proxy', createProxyMiddleware({
  target: 'https://cxbsldaoodddbqbfjqch.supabase.co',
  changeOrigin: true,
  pathRewrite: {
    '^/supabase-proxy': '',
  },
  on: {
    proxyReq: (proxyReq, req, res) => {
      console.log(`Proxying ${req.method} request to Supabase: ${req.url}`);
    },
    proxyRes: (proxyRes, req, res) => {
      console.log(`Supabase responded with status: ${proxyRes.statusCode}`);
      // Ensure CORS headers are present
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
      proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, apikey, x-client-info';
    },
    error: (err, req, res) => {
      console.error('Proxy Error:', err);
      if ('writeHead' in res && !res.headersSent) {
        res.writeHead(500);
      }
      res.end('Proxy Error');
    }
  }
}));

// 2. Other Middleware
app.use(cors());
app.use(express.json());

// Setup uploads directory (for legacy support if needed)
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use("/uploads", express.static(uploadsDir));

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start Server with Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
