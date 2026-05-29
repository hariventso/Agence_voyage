const API_BASE_URL = 'http://localhost:5000/api';

const jsonHeaders = { 'Content-Type': 'application/json' };

const fetchJson = async (url, options = {}) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    let errorMessage = `Erreur API (${response.status})`;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody.error || errorMessage;
    } catch {
      // No-op when backend does not return JSON.
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const apiService = {
  getAdminConfig: () => fetchJson(`${API_BASE_URL}/admin/config`),
  loginAdmin: (data) =>
    fetchJson(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(data),
    }),

  getServices: () => fetchJson(`${API_BASE_URL}/services`),
  deleteService: (id) => fetchJson(`${API_BASE_URL}/services/${id}`, { method: 'DELETE' }),
  createService: (data) =>
    fetchJson(`${API_BASE_URL}/services`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(data),
    }),
  updateService: (id, data) =>
    fetchJson(`${API_BASE_URL}/services/${id}`, {
      method: 'PUT',
      headers: jsonHeaders,
      body: JSON.stringify(data),
    }),

  getDestinations: () => fetchJson(`${API_BASE_URL}/destinations`),
  getDestination: (id) => fetchJson(`${API_BASE_URL}/destinations/${id}`),
  deleteDestination: (id) => fetchJson(`${API_BASE_URL}/destinations/${id}`, { method: 'DELETE' }),
  createDestination: (data) =>
    fetchJson(`${API_BASE_URL}/destinations`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(data),
    }),
  updateDestination: (id, data) =>
    fetchJson(`${API_BASE_URL}/destinations/${id}`, {
      method: 'PUT',
      headers: jsonHeaders,
      body: JSON.stringify(data),
    }),

  getPosts: () => fetchJson(`${API_BASE_URL}/posts`),
  deletePost: (id) => fetchJson(`${API_BASE_URL}/posts/${id}`, { method: 'DELETE' }),
  createPost: (data) =>
    fetchJson(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(data),
    }),
  updatePost: (id, data) =>
    fetchJson(`${API_BASE_URL}/posts/${id}`, {
      method: 'PUT',
      headers: jsonHeaders,
      body: JSON.stringify(data),
    }),

  getTeam: () => fetchJson(`${API_BASE_URL}/team`),
  deleteTeam: (id) => fetchJson(`${API_BASE_URL}/team/${id}`, { method: 'DELETE' }),
  createTeam: (data) =>
    fetchJson(`${API_BASE_URL}/team`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(data),
    }),
  updateTeam: (id, data) =>
    fetchJson(`${API_BASE_URL}/team/${id}`, {
      method: 'PUT',
      headers: jsonHeaders,
      body: JSON.stringify(data),
    }),

  getTestimonials: () => fetchJson(`${API_BASE_URL}/testimonials`),
  deleteTestimonial: (id) => fetchJson(`${API_BASE_URL}/testimonials/${id}`, { method: 'DELETE' }),
  createTestimonial: (data) =>
    fetchJson(`${API_BASE_URL}/testimonials`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(data),
    }),
  updateTestimonial: (id, data) =>
    fetchJson(`${API_BASE_URL}/testimonials/${id}`, {
      method: 'PUT',
      headers: jsonHeaders,
      body: JSON.stringify(data),
    }),

  getMessages: () => fetchJson(`${API_BASE_URL}/messages`),
  deleteMessage: (id) => fetchJson(`${API_BASE_URL}/messages/${id}`, { method: 'DELETE' }),
  markMessageRead: (id) => fetchJson(`${API_BASE_URL}/messages/${id}/read`, { method: 'PUT' }),
  createMessage: (data) =>
    fetchJson(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(data),
    }),

  getBookings: () => fetchJson(`${API_BASE_URL}/bookings`),
  deleteBooking: (id) => fetchJson(`${API_BASE_URL}/bookings/${id}`, { method: 'DELETE' }),
  updateBookingStatus: (id, status) =>
    fetchJson(`${API_BASE_URL}/bookings/${id}/status`, {
      method: 'PUT',
      headers: jsonHeaders,
      body: JSON.stringify({ status }),
    }),

  getEmployees: () => fetchJson(`${API_BASE_URL}/employees`),
  createEmployee: (data) =>
    fetchJson(`${API_BASE_URL}/employees`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(data),
    }),
  updateEmployee: (id, data) =>
    fetchJson(`${API_BASE_URL}/employees/${id}`, {
      method: 'PUT',
      headers: jsonHeaders,
      body: JSON.stringify(data),
    }),
  deleteEmployee: (id) => fetchJson(`${API_BASE_URL}/employees/${id}`, { method: 'DELETE' }),

  getCalendarEvents: (month) =>
    fetchJson(`${API_BASE_URL}/calendar-events${month ? `?month=${month}` : ''}`),
  createCalendarEvent: (data) =>
    fetchJson(`${API_BASE_URL}/calendar-events`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(data),
    }),
  updateCalendarEvent: (id, data) =>
    fetchJson(`${API_BASE_URL}/calendar-events/${id}`, {
      method: 'PUT',
      headers: jsonHeaders,
      body: JSON.stringify(data),
    }),
  deleteCalendarEvent: (id) => fetchJson(`${API_BASE_URL}/calendar-events/${id}`, { method: 'DELETE' }),
  sendCalendarReminders: () =>
    fetchJson(`${API_BASE_URL}/calendar-events/send-reminders`, {
      method: 'POST',
    }),
  sendCalendarTestEmail: (email) =>
    fetchJson(`${API_BASE_URL}/calendar-events/send-test-email`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(email ? { email } : {}),
    }),

  getSlides: () => fetchJson(`${API_BASE_URL}/slides`),
  deleteSlide: (id) => fetchJson(`${API_BASE_URL}/slides/${id}`, { method: 'DELETE' }),
  createSlide: (data) =>
    fetchJson(`${API_BASE_URL}/slides`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(data),
    }),
  updateSlide: (id, data) =>
    fetchJson(`${API_BASE_URL}/slides/${id}`, {
      method: 'PUT',
      headers: jsonHeaders,
      body: JSON.stringify(data),
    }),

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return fetchJson(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });
  },
};
