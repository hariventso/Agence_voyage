const API_BASE_URL = 'http://localhost:5000/api';

export const apiService = {
  // Destinations
  getDestinations: () => fetch(`${API_BASE_URL}/destinations`).then(res => res.json()),
  deleteDestination: (id) => fetch(`${API_BASE_URL}/destinations/${id}`, { method: 'DELETE' }),
  createDestination: (data) => fetch(`${API_BASE_URL}/destinations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  updateDestination: (id, data) => fetch(`${API_BASE_URL}/destinations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),

  // Posts
  getPosts: () => fetch(`${API_BASE_URL}/posts`).then(res => res.json()),
  deletePost: (id) => fetch(`${API_BASE_URL}/posts/${id}`, { method: 'DELETE' }),
  createPost: (data) => fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  updatePost: (id, data) => fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),

  // Team
  getTeam: () => fetch(`${API_BASE_URL}/team`).then(res => res.json()),
  deleteTeam: (id) => fetch(`${API_BASE_URL}/team/${id}`, { method: 'DELETE' }),
  createTeam: (data) => fetch(`${API_BASE_URL}/team`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  updateTeam: (id, data) => fetch(`${API_BASE_URL}/team/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),

  // Testimonials
  getTestimonials: () => fetch(`${API_BASE_URL}/testimonials`).then(res => res.json()),
  deleteTestimonial: (id) => fetch(`${API_BASE_URL}/testimonials/${id}`, { method: 'DELETE' }),
  createTestimonial: (data) => fetch(`${API_BASE_URL}/testimonials`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  updateTestimonial: (id, data) => fetch(`${API_BASE_URL}/testimonials/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),

  // Messages
  getMessages: () => fetch(`${API_BASE_URL}/messages`).then(res => res.json()),
  deleteMessage: (id) => fetch(`${API_BASE_URL}/messages/${id}`, { method: 'DELETE' }),
  markMessageRead: (id) => fetch(`${API_BASE_URL}/messages/${id}/read`, { method: 'PUT' }),

  // Bookings
  getBookings: () => fetch(`${API_BASE_URL}/bookings`).then(res => res.json()),
  deleteBooking: (id) => fetch(`${API_BASE_URL}/bookings/${id}`, { method: 'DELETE' }),
  updateBookingStatus: (id, status) => fetch(`${API_BASE_URL}/bookings/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  }),

  // Upload
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return fetch(`${API_BASE_URL}/upload`, { method: 'POST', body: formData }).then(res => res.json());
  }
};
