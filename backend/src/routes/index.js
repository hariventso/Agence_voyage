const express = require('express');

const adminRoutes = require('./admin.routes');
const bookingsRoutes = require('./bookings.routes');
const calendarRoutes = require('./calendar.routes');
const createCrudRouter = require('./crud-router');
const healthRoutes = require('./health.routes');
const messagesRoutes = require('./messages.routes');
const uploadRoutes = require('./upload.routes');

const withDefault = (name, defaultValue) => ({
  name,
  defaultValue,
  transform: (value, body, mode) => (value === undefined && mode === 'create' ? defaultValue : value),
});

const numberField = (name, fallback = 0) => ({
  name,
  defaultValue: fallback,
  transform: (value) => Number(value || fallback),
});

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    ok: true,
    message: 'API backend Agence Voyage',
    endpoints: [
      '/api/admin/config',
      '/api/health/db',
      '/api/services',
      '/api/destinations',
      '/api/posts',
      '/api/messages',
      '/api/bookings',
      '/api/team',
      '/api/testimonials',
      '/api/slides',
      '/api/employees',
      '/api/calendar-events',
    ],
  });
});

router.use('/admin', adminRoutes);
router.use('/health', healthRoutes);
router.use('/upload', uploadRoutes);

router.use(
  '/services',
  createCrudRouter({
    table: 'services',
    orderBy: 'id ASC',
    fields: ['name', 'description', 'image_url', withDefault('status', 'Actif')],
  })
);

router.use(
  '/destinations',
  createCrudRouter({
    table: 'destinations',
    orderBy: 'id ASC',
    getById: true,
    fields: [
      'name',
      'type',
      'price',
      'status',
      'image_url',
      'description',
      'itinerary',
      'accommodation',
      'budget',
      'tips',
      'highlights',
      'gallery',
    ],
  })
);

router.use(
  '/posts',
  createCrudRouter({
    table: 'posts',
    orderBy: 'created_at DESC',
    fields: ['title', 'category', 'content', 'image_url'],
  })
);

router.use('/messages', messagesRoutes);
router.use('/bookings', bookingsRoutes);

router.use(
  '/team',
  createCrudRouter({
    table: 'team',
    orderBy: 'id ASC',
    fields: [
      'name',
      'role',
      'bio',
      'image_url',
      'facebook_url',
      'twitter_url',
      'instagram_url',
      'pinterest_url',
    ],
  })
);

router.use(
  '/testimonials',
  createCrudRouter({
    table: 'testimonials',
    orderBy: 'created_at DESC',
    fields: ['name', 'role', 'content', 'rating', 'image_url'],
  })
);

router.use(
  '/slides',
  createCrudRouter({
    table: 'slides',
    orderBy: 'slide_order ASC',
    fields: ['title', 'subtitle', 'description', 'image_url', 'button_text', 'link', numberField('slide_order')],
  })
);

router.use(
  '/employees',
  createCrudRouter({
    table: 'employees',
    orderBy: 'name ASC',
    fields: ['name', 'email', 'role', 'phone', withDefault('status', 'Actif')],
  })
);

router.use('/calendar-events', calendarRoutes);

module.exports = router;
