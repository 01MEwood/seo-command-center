import { Router } from 'express';
import { log } from '../services/logger.js';
import crypto from 'crypto';

const router = Router();

// ── Simple password hashing (bcrypt-like with crypto) ──
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const check = crypto.scryptSync(password, salt, 64).toString('hex');
  return hash === check;
}

// ── Seed default users on first run ──
async function seedUsers(prisma) {
  const count = await prisma.user.count();
  if (count > 0) return;

  const defaultUsers = [
    { email: 'mario@schreinerhelden.de', name: 'Mario', password: 'meos2026!', role: 'admin' },
    { email: 'melanie@schreinerhelden.de', name: 'Melanie', password: 'marketing2026!', role: 'team' },
    { email: 'admin', name: 'Admin', password: 'schreinerhelden2026', role: 'admin' },
  ];

  for (const u of defaultUsers) {
    await prisma.user.create({
      data: { email: u.email, name: u.name, password: hashPassword(u.password), role: u.role },
    });
  }
  log.info(`Seeded ${defaultUsers.length} default users`);
}

// ── POST /api/auth/login ──
router.post('/login', async (req, res) => {
  try {
    const prisma = req.app.locals.prisma;
    await seedUsers(prisma);

    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email und Passwort erforderlich' });

    const user = await prisma.user.findFirst({
      where: { OR: [{ email }, { email: email.toLowerCase() }], active: true },
    });

    if (!user || !verifyPassword(password, user.password)) {
      return res.status(401).json({ error: 'Falscher Benutzername oder Passwort' });
    }

    // Update last login
    await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });

    // Return user (without password hash)
    const { password: _, ...safeUser } = user;
    res.json({ user: safeUser });
  } catch (error) {
    log.error('Login error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ── GET /api/auth/users (admin only) ──
router.get('/users', async (req, res) => {
  try {
    const users = await req.app.locals.prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, active: true, lastLogin: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
    res.json(users);
  } catch (error) {
    log.error('Users list error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ── POST /api/auth/users (admin: create user) ──
router.post('/users', async (req, res) => {
  try {
    const { email, name, password, role = 'viewer' } = req.body;
    if (!email || !name || !password) return res.status(400).json({ error: 'Email, Name und Passwort erforderlich' });

    const existing = await req.app.locals.prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email bereits vergeben' });

    const user = await req.app.locals.prisma.user.create({
      data: { email, name, password: hashPassword(password), role },
      select: { id: true, email: true, name: true, role: true, active: true, createdAt: true },
    });

    log.info(`User created: ${email} (${role})`);
    res.json(user);
  } catch (error) {
    log.error('User create error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ── PATCH /api/auth/users/:id (admin: update user) ──
router.patch('/users/:id', async (req, res) => {
  try {
    const { name, role, active, password } = req.body;
    const data = {};
    if (name !== undefined) data.name = name;
    if (role !== undefined) data.role = role;
    if (active !== undefined) data.active = active;
    if (password) data.password = hashPassword(password);

    const user = await req.app.locals.prisma.user.update({
      where: { id: req.params.id },
      data,
      select: { id: true, email: true, name: true, role: true, active: true, lastLogin: true, createdAt: true },
    });

    log.info(`User updated: ${user.email}`);
    res.json(user);
  } catch (error) {
    log.error('User update error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ── DELETE /api/auth/users/:id (admin: deactivate user) ──
router.delete('/users/:id', async (req, res) => {
  try {
    await req.app.locals.prisma.user.update({
      where: { id: req.params.id },
      data: { active: false },
    });
    res.json({ success: true });
  } catch (error) {
    log.error('User delete error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
