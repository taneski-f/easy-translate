import { ref, watch, computed, onMounted } from 'vue';

/**
 * Composable to manage application theme (light, dark, system)
 */
export function useAppTheme() {
  // Detect system preference
  const systemPrefersDark = ref(
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  // Get saved theme preference
  const savedTheme = localStorage.getItem('app-theme');
  const userPreference = ref(savedTheme);

  const isDark = computed({
    get() {
      if (userPreference.value === null) {
        return systemPrefersDark.value; // Follow system
      }
      return userPreference.value === 'dark';
    },
    set(value) {
      userPreference.value = value ? 'dark' : 'light';
    },
  });

  // Initialize theme
  const initializeTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Watch for system preference changes
  onMounted(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e) => {
      systemPrefersDark.value = e.matches;
    };
    mediaQuery.addEventListener('change', handleSystemChange);

    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  });

  // Watch for theme changes
  watch(
    isDark,
    (newValue) => {
      if (newValue) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    { immediate: true }
  );

  // Watch for user preference changes
  watch(userPreference, (newValue) => {
    if (newValue === null) {
      localStorage.removeItem('app-theme');
    } else {
      localStorage.setItem('app-theme', newValue);
    }
  });


  const toggleTheme = () => {
    userPreference.value = isDark.value ? 'light' : 'dark';
  };

  initializeTheme();

  return {
    isDark,
    systemPrefersDark: computed(() => systemPrefersDark.value),
    toggleTheme,
  };
}
