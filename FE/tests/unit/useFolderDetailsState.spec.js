/**
 *  Verifies per-folder state persistence (search/sort) is stored under a folder-specific key.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { defineComponent, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { useFolderDetailsState } from '@/composables/state/useFolderDetailsState.js';
import { PROJECT_SORT_FIELDS, SORT_ORDER } from '@/constants/index.js';

function mockStorage() {
  const store = new Map();
  return {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, v),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };
}

describe('useFolderDetailsState', () => {
  let originalLocalStorage;

  beforeEach(() => {
    originalLocalStorage = globalThis.localStorage;
    globalThis.localStorage = mockStorage();
  });

  it('persists per-folder state under folder-<id>-state', async () => {
    const Comp = defineComponent({
      setup() {
        return { ...useFolderDetailsState('42') };
      },
      template: '<div />',
    });
    const wrapper = mount(Comp);

    expect(wrapper.vm.sortBy).toBe(PROJECT_SORT_FIELDS.NAME);
    wrapper.vm.searchQuery = 'xyz';
    wrapper.vm.sortOrder = SORT_ORDER.DESC;
    await nextTick();

    const raw = globalThis.localStorage.getItem('folder-42-state');
    const parsed = JSON.parse(raw);
    expect(parsed.searchQuery).toBe('xyz');
    expect(parsed.sortOrder).toBe(SORT_ORDER.DESC);
  });

  afterEach(() => {
    globalThis.localStorage = originalLocalStorage;
  });
});
