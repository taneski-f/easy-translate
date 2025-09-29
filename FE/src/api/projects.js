import client from './client.js';

export async function fetchWorkspaceProjects() {
  const response = await client.get('/projects');
  return response.data;
}

export async function createProject(data) {
  const response = await client.post('/projects', data);
  return response.data;
}
