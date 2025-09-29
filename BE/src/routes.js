import { Router } from 'express';
import { apiGet, apiPost } from './services/apiClient.js';
import { config, ET_TEAM_API } from './config.js';

const router = Router();

/* USER ROUTES */

// Get authenticated user
router.get('/user', async (req, res) => {
  try {
    const url = `${config.baseUrl}/api/v1/user`;
    const response = await apiGet(url);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Get all folders
router.get('/folders', async (_req, res) => {
  try {
    const url = `${ET_TEAM_API}/folders`;
    const response = await apiGet(url);
    res.json(response.data);
  }
  catch (err) {
    res.status(500).json({ error: 'Failed to fetch folders' });
  }
});

/* FOLDER ROUTES */

// Create a new folder
router.post('/folders', async (req, res) => {
  try {
    const url = `${ET_TEAM_API}/folders`;
    const response = await apiPost(url, req.body);
    res.json(response.data);
  }
  catch (err) {
    res.status(500).json({ error: 'Failed to create folder' });
  }
});

// Get projects inside a folder 
router.get('/folders/:folderId/projects', async (req, res) => {
  try {
    const { folderId } = req.params;
    const headers = {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    };
    const url = `${ET_TEAM_API}/projects?filters[folder_id][]=${encodeURIComponent(folderId)}`;
    const resp = await apiGet(url, { headers });
    const data = Array.isArray(resp.data?.data) ? resp.data.data : [];
    return res.json({ data });
  }
  catch (err) {
    const status = err.response?.status || 500;
    const details = err.response?.data || err.message;
    console.error('Error fetching folder projects (proxy):', details);
    res.status(status).json({ error: 'Failed to fetch folder projects', details });
  }
});

/* PROJECT ROUTES */

// Get all workspace projects
router.get('/projects', async (_req, res) => {
  try {
    const url = `${ET_TEAM_API}/projects?filters[is_workspace]=true`;
    const response = await apiGet(url);
    res.json(response.data);
  }
  catch (err) {
    console.error('Error fetching projects:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

/* 
Create a new project - not included in API docs, should purposefully fail
Useful to demo creation error handling and some e2e tests
*/

router.post('/projects', async (req, res) => {
  try {
    const url = `${ET_TEAM_API}/projects`;
    const headers = {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    };
    const response = await apiPost(url, req.body, { headers });
    res.json(response.data);
  }
  catch (err) {
    const status = err.response?.status || 500;
    const details = err.response?.data || err.message;
    console.error('Error creating project:', details);
    res.status(status).json({ error: 'Failed to create project', details });
  }
});

export default router;
