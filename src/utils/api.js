// API utility for authenticated requests to backend
import { supabase } from './supabaseClient';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export async function getAuthToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token;
}

export async function fetchAPI(endpoint, options = {}) {
  const token = await getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API Error');
  }

  return response.json();
}

// Example usage:
// GET request
export function getCourses() {
  return fetchAPI('/courses');
}

// POST request with authentication
export function submitQuizAnswer(quizId, data) {
  return fetchAPI(`/quizzes/${quizId}/submit`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
