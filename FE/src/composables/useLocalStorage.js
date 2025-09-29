import { ref, watch, onMounted } from 'vue';

/*
 * Wrapper around localStorage that provides a reactive ref.
 * - Initializes from storage
 * - Persists changes automatically
 */
export function useLocalStorage(key, defaultValue, options = {}) {
  const { serialize = JSON.stringify, deserialize = JSON.parse, syncAcrossTabs = true } = options;

  const storedValue = ref(defaultValue);

  const read = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const write = (value) => {
    try {
      localStorage.setItem(key, serialize(value));
    } catch {
      console.warn(`useLocalStorage write failed for ${key}`);
    }
  };

  const remove = () => {
    try {
      localStorage.removeItem(key);
      storedValue.value = defaultValue;
    } catch {
      console.warn(`useLocalStorage remove failed for ${key}`);
    }
  };

  onMounted(() => {
    storedValue.value = read();
  });

  watch(storedValue, (nv) => write(nv), { deep: true });

  if (syncAcrossTabs && typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          storedValue.value = deserialize(e.newValue);
        } catch {
          /* ignore */
        }
      }
    });
  }

  return { value: storedValue, read, write, remove };
}
