// Central API client connecting to Modular Monolith Backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('marketplace_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `API error: ${response.status} ${response.statusText}`);
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials: any) => fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (payload: any) => fetchApi('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  getMe: () => fetchApi('/auth/me'),

  // Listings & Search
  getListings: (params: Record<string, any> = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, String(val));
      }
    });
    return fetchApi(`/listings?${searchParams.toString()}`);
  },
  getListing: (slugOrId: string) => fetchApi(`/listings/${slugOrId}`),
  createListing: (data: any) => fetchApi('/listings', { method: 'POST', body: JSON.stringify(data) }),
  getMyProviderListings: () => fetchApi('/listings/provider/mine'),
  updateListingStatus: (id: string, status: string) => fetchApi(`/listings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // Destinations & Categories
  getDestinations: (featuredOnly?: boolean) => fetchApi(`/destinations${featuredOnly ? '?featuredOnly=true' : ''}`),
  getCategories: () => fetchApi('/categories'),

  // Providers
  getProviders: (params: Record<string, any> = {}) => {
    const searchParams = new URLSearchParams(params);
    return fetchApi(`/providers?${searchParams.toString()}`);
  },
  getProvider: (id: string) => fetchApi(`/providers/${id}`),
  getMyProviderProfile: () => fetchApi('/providers/me/profile'),
  updateMyProviderProfile: (data: any) => fetchApi('/providers/me/profile', { method: 'PUT', body: JSON.stringify(data) }),
  submitVerification: (data: any) => fetchApi('/providers/me/verify', { method: 'POST', body: JSON.stringify(data) }),
  getProviderDashboard: () => fetchApi('/providers/me/dashboard'),

  // Bookings
  createBooking: (data: any) => fetchApi('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  getCustomerBookings: (status?: string) => fetchApi(`/bookings/customer${status ? `?status=${status}` : ''}`),
  getProviderBookings: (status?: string) => fetchApi(`/bookings/provider${status ? `?status=${status}` : ''}`),
  getBookingDetails: (id: string) => fetchApi(`/bookings/${id}`),
  updateBookingStatus: (id: string, status: string, notes?: string, reason?: string) => 
    fetchApi(`/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, notes, reason }) }),
  sendBookingMessage: (bookingId: string, message: string) => 
    fetchApi(`/bookings/${bookingId}/messages`, { method: 'POST', body: JSON.stringify({ message }) }),

  // Reviews
  submitReview: (data: any) => fetchApi('/reviews', { method: 'POST', body: JSON.stringify(data) }),
  reportReview: (id: string, reason: string) => fetchApi(`/reviews/${id}/report`, { method: 'POST', body: JSON.stringify({ reason }) }),

  // User
  getFavorites: () => fetchApi('/users/favorites'),
  toggleFavorite: (listingId: string) => fetchApi('/users/favorites', { method: 'POST', body: JSON.stringify({ listingId }) }),
  getNotifications: () => fetchApi('/users/notifications'),
  markNotificationRead: (id: string) => fetchApi(`/users/notifications/${id}/read`, { method: 'PATCH' }),

  // Admin
  getAdminOverview: () => fetchApi('/admin/overview'),
  getAdminUsers: (params?: any) => fetchApi(`/admin/users?${new URLSearchParams(params).toString()}`),
  toggleUserStatus: (id: string, data: any) => fetchApi(`/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  getAdminProviders: (params?: any) => fetchApi(`/admin/providers?${new URLSearchParams(params).toString()}`),
  verifyProvider: (id: string, status: string, notes?: string) => fetchApi(`/admin/providers/${id}/verify`, { method: 'PATCH', body: JSON.stringify({ status, notes }) }),
  getAdminListings: (params?: any) => fetchApi(`/admin/listings?${new URLSearchParams(params).toString()}`),
  moderateListing: (id: string, data: any) => fetchApi(`/admin/listings/${id}/moderate`, { method: 'PATCH', body: JSON.stringify(data) }),
  getAdminReviews: (params?: any) => fetchApi(`/admin/reviews?${new URLSearchParams(params).toString()}`),
  moderateReview: (id: string, status: string) => fetchApi(`/admin/reviews/${id}/moderate`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  getAdminBookings: (params?: any) => fetchApi(`/admin/bookings?${new URLSearchParams(params).toString()}`),
  getAuditLogs: (params?: any) => fetchApi(`/admin/audit-logs?${new URLSearchParams(params).toString()}`),

  // Content
  getBanners: () => fetchApi('/content/banners'),
  getCmsPages: () => fetchApi('/content/pages'),
};
