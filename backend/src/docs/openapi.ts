export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Multi-Provider Marketplace Platform API',
    version: '1.0.0',
    description: 'Phase 1 Production REST API powering Public Website, Customer Mobile App, Provider Dashboard, and Admin Control Panel.',
    contact: {
      name: 'Engineering Team',
      email: 'tech@marketplace.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local Development Server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  paths: {
    '/api/auth/register': {
      post: {
        summary: 'Register a new customer or provider account',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'user@example.com' },
                  password: { type: 'string', example: 'Password123!' },
                  firstName: { type: 'string', example: 'Ali' },
                  lastName: { type: 'string', example: 'Khan' },
                  role: { type: 'string', enum: ['CUSTOMER', 'PROVIDER'], example: 'CUSTOMER' },
                  businessName: { type: 'string', example: 'Apex Adventures' }
                },
                required: ['email', 'password', 'firstName', 'lastName']
              }
            }
          }
        },
        responses: {
          201: { description: 'Registration successful' }
        }
      }
    },
    '/api/auth/login': {
      post: {
        summary: 'Authenticate and receive JWT token',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'admin@marketplace.com' },
                  password: { type: 'string', example: 'Admin123!' }
                },
                required: ['email', 'password']
              }
            }
          }
        },
        responses: {
          200: { description: 'Login successful' }
        }
      }
    },
    '/api/listings': {
      get: {
        summary: 'Search & filter marketplace listings',
        tags: ['Listings'],
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'destination', in: 'query', schema: { type: 'string' } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'minPrice', in: 'query', schema: { type: 'number' } },
          { name: 'maxPrice', in: 'query', schema: { type: 'number' } },
          { name: 'minRating', in: 'query', schema: { type: 'number' } },
          { name: 'verifiedOnly', in: 'query', schema: { type: 'boolean' } },
          { name: 'sortBy', in: 'query', schema: { type: 'string', enum: ['featured', 'price_asc', 'price_desc', 'rating_desc', 'newest'] } }
        ],
        responses: {
          200: { description: 'List of matching listings' }
        }
      },
      post: {
        summary: 'Create a new listing (Provider only)',
        tags: ['Listings'],
        security: [{ bearerAuth: [] }],
        responses: {
          201: { description: 'Listing created' }
        }
      }
    },
    '/api/bookings': {
      post: {
        summary: 'Submit a booking or enquiry request',
        tags: ['Bookings'],
        security: [{ bearerAuth: [] }],
        responses: {
          201: { description: 'Booking request created' }
        }
      }
    },
    '/api/bookings/customer': {
      get: {
        summary: 'Get customer bookings with status tracking',
        tags: ['Bookings'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'List of customer bookings' } }
      }
    },
    '/api/bookings/provider': {
      get: {
        summary: 'Get provider bookings & requests',
        tags: ['Bookings'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'List of provider bookings' } }
      }
    },
    '/api/admin/overview': {
      get: {
        summary: 'Get operational KPIs and platform stats (Admin only)',
        tags: ['Administration'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Platform stats' } }
      }
    }
  }
};

export const swaggerUiHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Marketplace API Docs</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
  <style>
    body { margin: 0; background: #fafafa; font-family: sans-serif; }
    .topbar { background-color: #1e293b; padding: 10px 20px; color: white; display: flex; align-items: center; justify-content: space-between; }
    .topbar h1 { margin: 0; font-size: 18px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="topbar">
    <h1>Multi-Provider Marketplace — Phase 1 OpenAPI Specs</h1>
    <span>Modular Monolith API</span>
  </div>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
  <script>
    window.onload = function() {
      SwaggerUIBundle({
        url: '/api/docs/json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout"
      });
    }
  </script>
</body>
</html>
`;
