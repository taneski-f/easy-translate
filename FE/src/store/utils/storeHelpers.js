// Shared store utilities
/**
 * Generic sorting function for store items
 * @param {Array} items - Items to sort
 * @param {string} sortField - Field to sort by
 * @returns {Array} Sorted array
 */
export function sortItemsByName(items, sortField = 'name') {
  if (!Array.isArray(items)) return [];

  return [...items].sort((a, b) => {
    const nameA = a.attributes?.[sortField] || '';
    const nameB = b.attributes?.[sortField] || '';
    return nameA.localeCompare(nameB);
  });
}

/**
 * @param {Function} commit - Vuex commit function
 * @param {Function} apiCall - API function to call
 * @param {string} dataField - Field name to store data ('folders', 'workspaceProjects', etc.)
 * @param {string} loadingMutation - Loading mutation name
 * @param {string} dataMutation - Data mutation name
 * @param {string} errorContext - Context for error logging (user-friendly error message)
 */
export async function handleAsyncStoreAction({
  commit,
  apiCall,
  loadingMutation = 'setLoading',
  dataMutation,
  errorContext,
}) {
  // Trigger loading UI in components
  commit(loadingMutation, true);

  try {
    const response = await apiCall();
    const data = response?.data || [];
    commit(dataMutation, data);
  } catch (error) {
    console.error(`Error loading ${errorContext}:`, error);
    commit(dataMutation, []);
    // Re-throw error so components can handle errors - if needed
    throw error;
  } finally {
    // Always turn off loading state rehardless of success or failure
    commit(loadingMutation, false);
  }
}
