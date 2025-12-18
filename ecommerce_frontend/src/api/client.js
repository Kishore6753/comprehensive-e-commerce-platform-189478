const API_BASE = (process.env.REACT_APP_API_BASE || '').trim();

/**
 * Small helper to standardize fetch with timeouts and JSON parsing.
 * If API_BASE is empty, callers should use mock functions below.
 */
async function requestJson(path, options = {}) {
  const controller = new AbortController();
  const timeoutMs = 12000;
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...(options.headers || {})
      },
      signal: controller.signal
    });

    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    if (!res.ok) {
      const body = isJson ? await res.json().catch(() => null) : await res.text().catch(() => '');
      const message =
        (body && (body.message || body.error)) ||
        (typeof body === 'string' && body) ||
        `Request failed with status ${res.status}`;
      const err = new Error(message);
      err.status = res.status;
      err.body = body;
      throw err;
    }

    if (isJson) return res.json();
    return null;
  } finally {
    clearTimeout(id);
  }
}

// Lightweight mock catalog used when API_BASE is not set.
const mockProducts = [
  {
    id: 'p_001',
    name: 'Everyday Sneakers',
    price: 79.0,
    imageUrl: 'https://images.unsplash.com/photo-1528701800489-20be3c3ea0b4?auto=format&fit=crop&w=1200&q=80',
    description:
      'Comfort-first sneakers built for daily wear. Breathable knit upper, cushioned sole, and a clean silhouette.',
    category: 'Shoes'
  },
  {
    id: 'p_002',
    name: 'Minimalist Backpack',
    price: 54.0,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
    description:
      'A lightweight backpack with thoughtful organization. Fits a 15" laptop and your essentials.',
    category: 'Bags'
  },
  {
    id: 'p_003',
    name: 'Ceramic Mug Set',
    price: 32.0,
    imageUrl: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1200&q=80',
    description:
      'Set of 2 matte ceramic mugs. Dishwasher safe, perfect for coffee, tea, and cozy mornings.',
    category: 'Home'
  },
  {
    id: 'p_004',
    name: 'Wireless Earbuds',
    price: 129.0,
    imageUrl: 'https://images.unsplash.com/photo-1518441902117-f0aabf97fddd?auto=format&fit=crop&w=1200&q=80',
    description:
      'Clear sound, strong bass, and a compact charging case. Great for commutes, calls, and workouts.',
    category: 'Electronics'
  },
  {
    id: 'p_005',
    name: 'Soft Knit Hoodie',
    price: 64.0,
    imageUrl: 'https://images.unsplash.com/photo-1520975958225-9e8b5f8f2f18?auto=format&fit=crop&w=1200&q=80',
    description:
      'A soft, heavyweight hoodie with a relaxed fit. Easy layering for cooler days.',
    category: 'Apparel'
  },
  {
    id: 'p_006',
    name: 'Desk Plant',
    price: 18.0,
    imageUrl: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80',
    description:
      'A low-maintenance plant that brings life to your workspace. Includes a simple white pot.',
    category: 'Home'
  }
];

// PUBLIC_INTERFACE
export function isApiConfigured() {
  /** Returns true if REACT_APP_API_BASE is set and non-empty. */
  return Boolean(API_BASE);
}

// PUBLIC_INTERFACE
export async function listProducts() {
  /** Lists products from backend if configured, else returns mock data. */
  if (!isApiConfigured()) {
    await new Promise(r => setTimeout(r, 250));
    return mockProducts;
  }

  // Assumes backend might expose /products. If not, the UI still works with mock mode.
  return requestJson('/products');
}

// PUBLIC_INTERFACE
export async function getProduct(productId) {
  /** Gets a single product by id from backend if configured, else returns from mock data. */
  if (!isApiConfigured()) {
    await new Promise(r => setTimeout(r, 200));
    const found = mockProducts.find(p => p.id === productId);
    if (!found) {
      const err = new Error('Product not found');
      err.status = 404;
      throw err;
    }
    return found;
  }

  return requestJson(`/products/${encodeURIComponent(productId)}`);
}
