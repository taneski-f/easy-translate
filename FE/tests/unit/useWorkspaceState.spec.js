/**
 *   Ensures default workspace state values, localStorage persistence, and reset/clear helpers work as intended.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { nextTick, defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { useWorkspaceState } from '@/composables/state/useWorkspaceState.js';
import { FOLDER_SORT_FIELDS, PROJECT_SORT_FIELDS, SORT_ORDER } from '@/constants/index.js';

// Lightweight localStorage mock per test
function mockStorage() {
  const store = new Map();
  return {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, v),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
    key: (i) => Array.from(store.keys())[i] ?? null,
    get length() {
      return store.size;
    },
    _dump: () => Object.fromEntries(store.entries()),
  };
}

describe('useWorkspaceState', () => {
  let originalLocalStorage;

  beforeEach(() => {
    originalLocalStorage = globalThis.localStorage;
    globalThis.localStorage = mockStorage();
  });

  it('initializes with defaults and writes to localStorage', async () => {
    const Comp = defineComponent({
      setup() {
        return { ...useWorkspaceState() };
      },
      template: '<div />',
    });

    const wrapper = mount(Comp);

    expect(wrapper.vm.folderSortBy).toBe(FOLDER_SORT_FIELDS.NAME);
    expect(wrapper.vm.projectSortBy).toBe(PROJECT_SORT_FIELDS.NAME);
    expect(wrapper.vm.folderPanelOpen).toBe(true);

    // mutate and verify persistence
    wrapper.vm.folderSearchQuery = 'test';
    wrapper.vm.projectSortOrder = SORT_ORDER.DESC;
    await nextTick();

    const raw = globalThis.localStorage.getItem('workspace-state');
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw);
    expect(parsed.folders.searchQuery).toBe('test');
    expect(parsed.projects.sortOrder).toBe(SORT_ORDER.DESC);
  });

  it('reset helpers restore defaults', async () => {
    const Comp = defineComponent({
      setup() {
        return { ...useWorkspaceState() };
      },
      template: '<div />',
    });
    const wrapper = mount(Comp);
    wrapper.vm.folderSortBy = FOLDER_SORT_FIELDS.TOTAL_PROJECTS;
    wrapper.vm.projectSortOrder = SORT_ORDER.DESC;
    wrapper.vm.resetAllState();
    await nextTick();

    expect(wrapper.vm.folderSortBy).toBe(FOLDER_SORT_FIELDS.NAME);
    expect(wrapper.vm.projectSortOrder).toBe(SORT_ORDER.ASC);
  });

  it('clearAllStoredData removes keys', async () => {
    const Comp = defineComponent({
      setup() {
        return { ...useWorkspaceState() };
      },
      template: '<div />',
    });
    const wrapper = mount(Comp);
    wrapper.vm.folderSearchQuery = 'persist';
    await nextTick();

    expect(globalThis.localStorage.getItem('workspace-state')).toBeTruthy();
    wrapper.vm.clearAllStoredData();
    await nextTick();
    expect(globalThis.localStorage.getItem('workspace-state')).toBeNull();
  });

  afterEach(() => {
    globalThis.localStorage = originalLocalStorage;
  });
});
