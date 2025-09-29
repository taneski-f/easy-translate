/**
 * - Tests sorting for folders: name ascending/descending and switching to total_projects.
 * - Tests sorting for projects: by price then by status.
 */

import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { useSorting } from '@/composables/ui/useSorting.js';
import { FOLDER_SORT_FIELDS, PROJECT_SORT_FIELDS, SORT_ORDER } from '@/constants/index.js';

const folders = [
  {
    attributes: {
      name: 'Folder2',
      total_projects: 2,
      created_at: '2024-01-02',
      updated_at: '2024-01-03',
    },
  },
  {
    attributes: {
      name: 'Folder1',
      total_projects: 5,
      created_at: '2024-01-01',
      updated_at: '2024-01-04',
    },
  },
  {
    attributes: {
      name: 'Folder3',
      total_projects: 1,
      created_at: '2024-02-01',
      updated_at: '2024-02-02',
    },
  },
];

const projects = [
  {
    attributes: {
      name: 'Project3',
      status: 'in_progress',
      price: { amount_euro: 200 },
      created_at: '2024-01-05',
      updated_at: '2024-01-06',
    },
  },
  {
    attributes: {
      name: 'Project1',
      status: 'completed',
      price: { amount_euro: 100 },
      created_at: '2024-01-03',
      updated_at: '2024-01-07',
    },
  },
  {
    attributes: {
      name: 'Project2',
      status: 'pending',
      price: { amount_euro: 150 },
      created_at: '2024-01-04',
      updated_at: '2024-01-08',
    },
  },
];

describe('useSorting', () => {
  it('sorts folders by name asc then desc', () => {
    const items = ref(folders);
    const { sortBy, sortOrder, sortedItems, toggleSortOrder } = useSorting(
      items,
      FOLDER_SORT_FIELDS.NAME,
      SORT_ORDER.ASC
    );

    expect(sortedItems.value.map((i) => i.attributes.name)).toEqual([
      'Folder1',
      'Folder2',
      'Folder3',
    ]);

    toggleSortOrder();
    expect(sortOrder.value).toBe(SORT_ORDER.DESC);
    expect(sortedItems.value.map((i) => i.attributes.name)).toEqual([
      'Folder3',
      'Folder2',
      'Folder1',
    ]);

    // switch field
    sortBy.value = FOLDER_SORT_FIELDS.TOTAL_PROJECTS;
    expect(sortedItems.value.map((i) => i.attributes.total_projects)).toEqual([5, 2, 1]);
  });

  it('sorts projects by price and status', () => {
    const items = ref(projects);
    const { sortBy, sortedItems } = useSorting(items, PROJECT_SORT_FIELDS.PRICE, SORT_ORDER.ASC);

    expect(sortedItems.value.map((i) => i.attributes.price.amount_euro)).toEqual([100, 150, 200]);

    sortBy.value = PROJECT_SORT_FIELDS.STATUS;
    // alphabetical by status
    expect(sortedItems.value.map((i) => i.attributes.status)).toEqual([
      'completed',
      'in_progress',
      'pending',
    ]);
  });
});
