export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'POST') {
    const { password } = req.body || {};
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ramiya2024';
    if (password === ADMIN_PASSWORD) {
      return res.status(200).json({ ok: true, token: 'ramiya-admin-' + Date.now() });
    }
    return res.status(401).json({ ok: false, error: 'Incorrect password' });
  }
  res.status(405).json({ error: 'Method not allowed' });
}
