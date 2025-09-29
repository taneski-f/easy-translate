import client from './client.js';

export async function fetchFolders() {
  const response = await client.get('/folders');
  return response.data;
}

// Fetch projects inside a folder
export async function fetchFolderProjects(folderId) {
  const response = await client.get(`/folders/${folderId}/projects`);
  return response.data;
}

export async function createFolder(data) {
  const response = await client.post('/folders', data);
  return response.data;
}
