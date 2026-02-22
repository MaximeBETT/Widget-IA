const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config({ override: true });

const chatRoutes = require('./server/routes/chat');
const adminRoutes = require('./server/routes/admin');
const auth = require('./server/middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS - autorise ton site + le domaine Render
const allowedOrigins = [
  'https://webetton.fr',
  'https://www.webetton.fr',
  'http://webetton.fr',
  'http://www.webetton.fr',
  'https://widget-ia-8d1d.onrender.com',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://maximebett.github.io'
];

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: function(origin, callback) {
    // Autoriser les requêtes sans origin (Postman, curl, admin panel)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    callback(new Error('Bloqué par CORS'));
  },
  credentials: true
}));

// Serve static files (widget + admin interface)
app.use(express.static('public'));

// Routes API publiques
app.use('/api/chat', chatRoutes);

// Routes protégées admin
app.use('/api/admin', auth.verifyToken, adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Widget-IA server running on port ${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin.html`);
  console.log(`Widget integration: Add this to your site:`);
  console.log(`<script src="http://localhost:${PORT}/widget.js"></script>`);
});
