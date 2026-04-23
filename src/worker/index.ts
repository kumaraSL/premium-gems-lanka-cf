import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { signToken, verifyToken, getTokenFromRequest, JWTPayload } from './lib/auth';
import { uploadToR2, getPublicUrl, serveR2Object } from './lib/r2';

export type Env = {
  DB: D1Database;
  MEDIA_BUCKET: R2Bucket;
  JWT_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  PUBLIC_R2_URL: string;
  ADMIN_EMAIL: string;
};

const app = new Hono<{ Bindings: Env }>();

// CORS
app.use('/api/*', cors({ origin: '*', credentials: true }));

// ─────────────────────────────────────────
// Auth Middleware Helper
// ─────────────────────────────────────────
async function getUser(c: any): Promise<JWTPayload | null> {
  const token = getTokenFromRequest(c.req.raw);
  if (!token) return null;
  return verifyToken(token, c.env.JWT_SECRET);
}

// ─────────────────────────────────────────
// AUTH ROUTES
// ─────────────────────────────────────────

// Google OAuth — redirect to Google
app.get('/api/auth/google', async (c) => {
  const redirectUri = new URL('/api/auth/google/callback', c.req.url).toString();
  const params = new URLSearchParams({
    client_id: c.env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account',
  });
  return c.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

// Google OAuth — callback
app.get('/api/auth/google/callback', async (c) => {
  const code = c.req.query('code');
  if (!code) return c.redirect('/?error=no_code');

  try {
    const redirectUri = new URL('/api/auth/google/callback', c.req.url).toString();

    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: c.env.GOOGLE_CLIENT_ID,
        client_secret: c.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });
    const tokenData = await tokenRes.json() as any;
    if (!tokenData.access_token) return c.redirect('/?error=token_exchange_failed');

    // Get user info
    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const googleUser = await userRes.json() as any;

    const userId = `google_${googleUser.sub}`;
    const isAdmin = googleUser.email === c.env.ADMIN_EMAIL;

    // Upsert user in D1
    await c.env.DB.prepare(`
      INSERT INTO users (id, email, display_name, photo_url, role, created_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
      ON CONFLICT(id) DO UPDATE SET
        display_name = excluded.display_name,
        photo_url = excluded.photo_url,
        role = CASE WHEN excluded.email = ? THEN 'admin' ELSE users.role END
    `).bind(
      userId,
      googleUser.email,
      googleUser.name || googleUser.email,
      googleUser.picture || '',
      isAdmin ? 'admin' : 'customer',
      c.env.ADMIN_EMAIL
    ).run();

    const user = await c.env.DB.prepare(
      'SELECT * FROM users WHERE id = ?'
    ).bind(userId).first() as any;

    const jwt = await signToken({
      sub: user.id,
      email: user.email,
      name: user.display_name,
      role: user.role,
    }, c.env.JWT_SECRET);

    const response = c.redirect('/profile');
    response.headers.append(
      'Set-Cookie',
      `auth_token=${jwt}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${7 * 24 * 60 * 60}`
    );
    return response;
  } catch (err) {
    console.error('OAuth callback error:', err);
    return c.redirect('/?error=auth_failed');
  }
});

// Get current user
app.get('/api/auth/me', async (c) => {
  const user = await getUser(c);
  if (!user) return c.json({ user: null });
  return c.json({ user });
});

// Logout
app.post('/api/auth/logout', (c) => {
  const res = c.json({ success: true });
  res.headers.append('Set-Cookie', 'auth_token=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0');
  return res;
});

// ─────────────────────────────────────────
// PRODUCTS ROUTES
// ─────────────────────────────────────────

app.get('/api/products', async (c) => {
  const category = c.req.query('category');
  const sort = c.req.query('sort') || 'new';
  const limit = parseInt(c.req.query('limit') || '100');

  let query = 'SELECT * FROM products';
  const params: any[] = [];

  if (category && category !== 'All') {
    query += ' WHERE category = ?';
    params.push(category);
  }

  query += sort === 'price_asc' ? ' ORDER BY price ASC' :
           sort === 'price_desc' ? ' ORDER BY price DESC' :
           ' ORDER BY created_at DESC';
  query += ` LIMIT ${limit}`;

  const { results } = await c.env.DB.prepare(query).bind(...params).all();
  const products = results.map((p: any) => {
    const imageUrl = p.image_url && !p.image_url.startsWith('http') 
      ? getPublicUrl(p.image_url, c.env.PUBLIC_R2_URL) 
      : p.image_url;
    
    return {
      ...p,
      image_url: imageUrl,
      images: JSON.parse(p.images || '[]').map((img: string) => 
        !img.startsWith('http') ? getPublicUrl(img, c.env.PUBLIC_R2_URL) : img
      ),
    };
  });
  return c.json({ products });
});

app.get('/api/products/:id', async (c) => {
  const product = await c.env.DB.prepare(
    'SELECT * FROM products WHERE id = ?'
  ).bind(c.req.param('id')).first() as any;

  if (!product) return c.json({ error: 'Not found' }, 404);
  return c.json({ product: { ...product, images: JSON.parse(product.images || '[]') } });
});

app.post('/api/products', async (c) => {
  const user = await getUser(c);
  if (!user || user.role !== 'admin') return c.json({ error: 'Unauthorized' }, 401);

  const body = await c.req.json() as any;
  const id = crypto.randomUUID();

  await c.env.DB.prepare(`
    INSERT INTO products (id, name, description, price, category, image_url, images, video_url, stock, weight, shape, color, treatment, height, width, depth, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `).bind(
    id, body.name, body.description, body.price, body.category,
    body.imageUrl, JSON.stringify(body.images || []), body.videoUrl || '',
    body.stock, body.weight || 0, body.shape || '', body.color || '',
    body.treatment || '', body.height || 0, body.width || 0, body.depth || 0
  ).run();

  const product = await c.env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(id).first();
  return c.json({ product }, 201);
});

app.put('/api/products/:id', async (c) => {
  const user = await getUser(c);
  if (!user || user.role !== 'admin') return c.json({ error: 'Unauthorized' }, 401);

  const body = await c.req.json() as any;
  const id = c.req.param('id');

  await c.env.DB.prepare(`
    UPDATE products SET name=?, description=?, price=?, category=?, image_url=?, images=?,
    video_url=?, stock=?, weight=?, shape=?, color=?, treatment=?, height=?, width=?, depth=?
    WHERE id=?
  `).bind(
    body.name, body.description, body.price, body.category,
    body.imageUrl, JSON.stringify(body.images || []), body.videoUrl || '',
    body.stock, body.weight || 0, body.shape || '', body.color || '',
    body.treatment || '', body.height || 0, body.width || 0, body.depth || 0, id
  ).run();

  return c.json({ success: true });
});

app.delete('/api/products/:id', async (c) => {
  const user = await getUser(c);
  if (!user || user.role !== 'admin') return c.json({ error: 'Unauthorized' }, 401);

  await c.env.DB.prepare('DELETE FROM products WHERE id = ?').bind(c.req.param('id')).run();
  return c.json({ success: true });
});

// ─────────────────────────────────────────
// CART ROUTES
// ─────────────────────────────────────────

app.get('/api/cart', async (c) => {
  const user = await getUser(c);
  if (!user) return c.json({ items: [] });

  const { results } = await c.env.DB.prepare(
    'SELECT * FROM cart_items WHERE user_id = ? ORDER BY added_at DESC'
  ).bind(user.sub).all();
  return c.json({ items: results });
});

app.post('/api/cart', async (c) => {
  const user = await getUser(c);
  if (!user) return c.json({ error: 'Login required' }, 401);

  const body = await c.req.json() as any;

  // Check existing
  const existing = await c.env.DB.prepare(
    'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?'
  ).bind(user.sub, body.productId).first() as any;

  if (existing) {
    await c.env.DB.prepare(
      'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?'
    ).bind(body.quantity || 1, existing.id).run();
  } else {
    const id = crypto.randomUUID();
    await c.env.DB.prepare(`
      INSERT INTO cart_items (id, user_id, product_id, name, price, image_url, quantity, added_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(
      id, user.sub, body.productId, body.name, body.price,
      body.imageUrl, body.quantity || 1
    ).run();
  }

  const { results } = await c.env.DB.prepare(
    'SELECT * FROM cart_items WHERE user_id = ?'
  ).bind(user.sub).all();
  return c.json({ items: results });
});

app.put('/api/cart/:id', async (c) => {
  const user = await getUser(c);
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const { quantity } = await c.req.json() as any;

  if (quantity <= 0) {
    await c.env.DB.prepare(
      'DELETE FROM cart_items WHERE id = ? AND user_id = ?'
    ).bind(c.req.param('id'), user.sub).run();
  } else {
    await c.env.DB.prepare(
      'UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?'
    ).bind(quantity, c.req.param('id'), user.sub).run();
  }

  const { results } = await c.env.DB.prepare(
    'SELECT * FROM cart_items WHERE user_id = ?'
  ).bind(user.sub).all();
  return c.json({ items: results });
});

app.delete('/api/cart/:id', async (c) => {
  const user = await getUser(c);
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  await c.env.DB.prepare(
    'DELETE FROM cart_items WHERE id = ? AND user_id = ?'
  ).bind(c.req.param('id'), user.sub).run();
  return c.json({ success: true });
});

app.delete('/api/cart', async (c) => {
  const user = await getUser(c);
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  await c.env.DB.prepare('DELETE FROM cart_items WHERE user_id = ?').bind(user.sub).run();
  return c.json({ success: true });
});

// ─────────────────────────────────────────
// ORDERS ROUTES
// ─────────────────────────────────────────

app.get('/api/orders', async (c) => {
  const user = await getUser(c);
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  let orders: any[];

  if (user.role === 'admin') {
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM orders ORDER BY created_at DESC'
    ).all();
    orders = results as any[];
  } else {
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC'
    ).bind(user.sub).all();
    orders = results as any[];
  }

  // Attach items to each order
  const ordersWithItems = await Promise.all(orders.map(async (order: any) => {
    const { results: items } = await c.env.DB.prepare(
      'SELECT * FROM order_items WHERE order_id = ?'
    ).bind(order.id).all();
    return { ...order, items };
  }));

  return c.json({ orders: ordersWithItems });
});

app.post('/api/checkout', async (c) => {
  const user = await getUser(c);
  if (!user) return c.json({ error: 'Login required' }, 401);

  const body = await c.req.json() as any;

  // Get cart items
  const { results: cartItems } = await c.env.DB.prepare(
    'SELECT * FROM cart_items WHERE user_id = ?'
  ).bind(user.sub).all() as any;

  if (!cartItems.length) return c.json({ error: 'Cart is empty' }, 400);

  const totalAmount = cartItems.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity, 0
  );
  const orderId = crypto.randomUUID();

  await c.env.DB.prepare(`
    INSERT INTO orders (id, user_id, total_amount, status, shipping_address, shipping_name, shipping_email, shipping_phone, notes, created_at)
    VALUES (?, ?, ?, 'pending', ?, ?, ?, ?, ?, datetime('now'))
  `).bind(
    orderId, user.sub, totalAmount,
    body.shippingAddress || '',
    body.name || user.name,
    body.email || user.email,
    body.phone || '',
    body.notes || ''
  ).run();

  for (const item of cartItems) {
    await c.env.DB.prepare(`
      INSERT INTO order_items (id, order_id, product_id, name, price, image_url, quantity)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      crypto.randomUUID(), orderId, item.product_id,
      item.name, item.price, item.image_url, item.quantity
    ).run();
  }

  // Clear cart
  await c.env.DB.prepare('DELETE FROM cart_items WHERE user_id = ?').bind(user.sub).run();

  return c.json({ success: true, orderId });
});

app.patch('/api/orders/:id', async (c) => {
  const user = await getUser(c);
  if (!user || user.role !== 'admin') return c.json({ error: 'Unauthorized' }, 401);

  const { status } = await c.req.json() as any;
  await c.env.DB.prepare('UPDATE orders SET status = ? WHERE id = ?').bind(status, c.req.param('id')).run();
  return c.json({ success: true });
});

// ─────────────────────────────────────────
// JOURNAL ROUTES
// ─────────────────────────────────────────

app.get('/api/journal', async (c) => {
  const limit = parseInt(c.req.query('limit') || '20');
  const { results } = await c.env.DB.prepare(
    `SELECT * FROM journal_posts ORDER BY created_at DESC LIMIT ${limit}`
  ).all();
  const posts = results.map((p: any) => {
    const heroImageUrl = p.hero_image_url && !p.hero_image_url.startsWith('http')
      ? getPublicUrl(p.hero_image_url, c.env.PUBLIC_R2_URL)
      : p.hero_image_url;

    return {
      ...p,
      hero_image_url: heroImageUrl,
      sections: JSON.parse(p.sections || '[]').map((section: any) => ({
        ...section,
        imageUrl: section.imageUrl && !section.imageUrl.startsWith('http')
          ? getPublicUrl(section.imageUrl, c.env.PUBLIC_R2_URL)
          : section.imageUrl
      })),
    };
  });
  return c.json({ posts });
});

app.get('/api/journal/:id', async (c) => {
  const post = await c.env.DB.prepare(
    'SELECT * FROM journal_posts WHERE id = ?'
  ).bind(c.req.param('id')).first() as any;

  if (!post) return c.json({ error: 'Not found' }, 404);

  const heroImageUrl = post.hero_image_url && !post.hero_image_url.startsWith('http')
    ? getPublicUrl(post.hero_image_url, c.env.PUBLIC_R2_URL)
    : post.hero_image_url;

  const sections = JSON.parse(post.sections || '[]').map((section: any) => ({
    ...section,
    imageUrl: section.imageUrl && !section.imageUrl.startsWith('http')
      ? getPublicUrl(section.imageUrl, c.env.PUBLIC_R2_URL)
      : section.imageUrl
  }));

  return c.json({ post: { ...post, hero_image_url: heroImageUrl, sections } });
});

app.post('/api/journal', async (c) => {
  const user = await getUser(c);
  if (!user || user.role !== 'admin') return c.json({ error: 'Unauthorized' }, 401);

  const body = await c.req.json() as any;
  const id = crypto.randomUUID();

  await c.env.DB.prepare(`
    INSERT INTO journal_posts (id, title, author, hero_image_url, introduction, sections, conclusion, cta_text, cta_link, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `).bind(
    id, body.title, body.author || user.name,
    body.heroImageUrl, body.introduction,
    JSON.stringify(body.sections || []),
    body.conclusion || '', body.ctaText || '', body.ctaLink || ''
  ).run();

  const post = await c.env.DB.prepare('SELECT * FROM journal_posts WHERE id = ?').bind(id).first();
  return c.json({ post }, 201);
});

app.delete('/api/journal/:id', async (c) => {
  const user = await getUser(c);
  if (!user || user.role !== 'admin') return c.json({ error: 'Unauthorized' }, 401);

  await c.env.DB.prepare('DELETE FROM journal_posts WHERE id = ?').bind(c.req.param('id')).run();
  return c.json({ success: true });
});

// ─────────────────────────────────────────
// FILE UPLOAD ROUTE
// ─────────────────────────────────────────

app.post('/api/media/upload', async (c) => {
  const user = await getUser(c);
  if (!user || user.role !== 'admin') return c.json({ error: 'Unauthorized' }, 401);

  const formData = await c.req.formData();
  const file = formData.get('file') as File | null;
  const folder = (formData.get('folder') as string) || 'uploads';

  if (!file) return c.json({ error: 'No file provided' }, 400);

  const key = await uploadToR2(c.env.MEDIA_BUCKET, file, folder);
  const url = getPublicUrl(key, c.env.PUBLIC_R2_URL);

  return c.json({ url, key });
});

// Serve R2 media
app.get('/media/:folder/:filename', async (c) => {
  const key = `${c.req.param('folder')}/${c.req.param('filename')}`;
  return serveR2Object(c.env.MEDIA_BUCKET, key);
});

// ─────────────────────────────────────────
// CUSTOM ORDER ROUTE
// ─────────────────────────────────────────

app.post('/api/custom-order', async (c) => {
  const body = await c.req.json() as any;
  const id = crypto.randomUUID();

  await c.env.DB.prepare(`
    INSERT INTO custom_orders (id, name, email, phone, gem_type, shape, color, weight_min, weight_max, budget, notes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `).bind(
    id, body.name, body.email, body.phone || '',
    body.gemType || '', body.shape || '', body.color || '',
    body.weightMin || 0, body.weightMax || 0,
    body.budget || '', body.notes || ''
  ).run();

  return c.json({ success: true, id });
});

// Admin: get custom orders
app.get('/api/custom-orders', async (c) => {
  const user = await getUser(c);
  if (!user || user.role !== 'admin') return c.json({ error: 'Unauthorized' }, 401);

  const { results } = await c.env.DB.prepare(
    'SELECT * FROM custom_orders ORDER BY created_at DESC'
  ).all();
  return c.json({ orders: results });
});

// Admin: get all users
app.get('/api/users', async (c) => {
  const user = await getUser(c);
  if (!user || user.role !== 'admin') return c.json({ error: 'Unauthorized' }, 401);

  const { results } = await c.env.DB.prepare(
    'SELECT id, email, display_name, role, created_at FROM users ORDER BY created_at DESC'
  ).all();
  return c.json({ users: results });
});

// Admin: update user role
app.patch('/api/users/:id', async (c) => {
  const user = await getUser(c);
  if (!user || user.role !== 'admin') return c.json({ error: 'Unauthorized' }, 401);

  const { role } = await c.req.json() as any;
  await c.env.DB.prepare('UPDATE users SET role = ? WHERE id = ?').bind(role, c.req.param('id')).run();
  return c.json({ success: true });
});

// ─────────────────────────────────────────
// HEALTH CHECK
// ─────────────────────────────────────────

app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

export default app;
