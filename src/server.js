const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const chatRoutes = require('./server/routes/chat');
const adminRoutes = require('./server/routes/admin');
const auth = require('./server/middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

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
