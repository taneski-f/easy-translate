/*
 *   Verifies that the Vuex `projects` module loads projects for a given folder id
 *   and stores them in a keyed structure accessible via the `folderProjects` getter.
 * - Ensures unknown folder ids safely return an empty array.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createStore } from 'vuex';
import projectsModule from '@/store/modules/projects.js';

// Mock the API
vi.mock('@/api/index.js', () => ({
  fetchFolderProjects: vi.fn(() =>
    Promise.resolve({
      data: [
        { id: '1', attributes: { name: 'Project1' } },
        { id: '2', attributes: { name: 'Project2' } },
      ],
    })
  ),
}));

describe('Projects Store - Folder Projects', () => {
  let store;

  beforeEach(() => {
    store = createStore({
      modules: { projects: projectsModule },
    });
  });

  it('loads folder projects and stores them by folder ID', async () => {
    const folderId = 'folder-123';

    await store.dispatch('projects/loadFolderProjects', folderId);

    const folderProjects = store.getters['projects/folderProjects'](folderId);
    expect(folderProjects).toHaveLength(2);
    expect(folderProjects[0].attributes.name).toBe('Project1');
  });

  it('returns empty array for unknown folder ID', () => {
    const folderProjects = store.getters['projects/folderProjects']('unknown-folder');
    expect(folderProjects).toEqual([]);
  });
});
