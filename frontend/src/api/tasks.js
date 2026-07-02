const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function handleResponse(res) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }
  return body;
}

export async function fetchTasks(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v && v !== 'all')
  ).toString();
  const res = await fetch(`${API_URL}/tasks${query ? `?${query}` : ''}`);
  const body = await handleResponse(res);
  return body.data;
}

export async function createTask(payload) {
  const res = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await handleResponse(res);
  return body.data;
}

export async function updateTask(id, payload) {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await handleResponse(res);
  return body.data;
}

export async function deleteTask(id) {
  const res = await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
  return handleResponse(res);
}
