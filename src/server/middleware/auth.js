// Simple auth middleware (uses admin token)
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  const adminToken = process.env.ADMIN_TOKEN || 'your-secret-admin-token';

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (token !== adminToken) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  next();
};

module.exports = { verifyToken };
