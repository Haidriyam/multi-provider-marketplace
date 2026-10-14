import { Platform } from 'react-native';

const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api';

export const mobileApi = {
  baseUrl: BASE_URL,

  async getListings(params: Record<string, string> = {}) {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/listings${qs ? `?${qs}` : ''}`);
    return res.json();
  },

  async getListingDetails(slugOrId: string) {
    const res = await fetch(`${BASE_URL}/listings/${slugOrId}`);
    return res.json();
  },

  async getDestinations() {
    const res = await fetch(`${BASE_URL}/destinations?featuredOnly=true`);
    return res.json();
  },

  async getCategories() {
    const res = await fetch(`${BASE_URL}/categories`);
    return res.json();
  },

  async login(email: string, password: string) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async createBooking(token: string, payload: any) {
    const res = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async getCustomerBookings(token: string) {
    const res = await fetch(`${BASE_URL}/bookings/customer`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  }
};
