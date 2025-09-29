/**
 *   Validates emitting updated model values on input change
 *   and clearing the input when the clear icon is clicked.
 * 
 * - Serves as just an example for the only input component we have so far.
 */
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SearchInput from '@/components/common/forms/SearchInput.vue';
import { createI18n } from 'vue-i18n';
import en from '@/i18n/locales/en.json';

describe('SearchInput', () => {
  const i18n = createI18n({ legacy: false, locale: 'en', messages: { en } });

  it('renders and emits input updates', async () => {
    const wrapper = mount(SearchInput, {
      props: { modelValue: '', placeholderKey: 'search.placeholder' },
      global: { plugins: [i18n] },
    });

    const input = wrapper.find('input');
    await input.setValue('hello');

    expect(wrapper.emitted('update:modelValue')[0][0]).toBe('hello');
  });

  it('clears when clicking the clear icon', async () => {
    const wrapper = mount(SearchInput, {
      props: { modelValue: 'abc', placeholderKey: 'search.placeholder' },
      global: { plugins: [i18n] },
    });

    const clearBtn = wrapper.find('.mdi-close');
    await clearBtn.trigger('click');

    expect(wrapper.emitted('update:modelValue')[0][0]).toBe('');
  });
});
