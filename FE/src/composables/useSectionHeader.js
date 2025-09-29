// Composable for section header logic (e.g., sort options, empty state text, create button text)

export function useSectionHeader() {
  function getSortOptions(itemType) {
    const baseOptions = [
      { value: 'name', label: 'Name' },
      { value: 'created_at', label: 'Created Date' },
    ];

    if (itemType === 'projects') {
      return [
        ...baseOptions,
        { value: 'status', label: 'Status' },
        { value: 'priority', label: 'Priority' },
      ];
    }

    return baseOptions;
  }
  // Could be abstracted further if more item types are added
  function getEmptyStateText(itemType) {
    return itemType === 'folders'
      ? 'No folders yet. Create your first folder to organize your translations.'
      : 'No projects yet. Create your first project to start translating.';
  }

  function getCreateButtonText(itemType) {
    return itemType === 'folders' ? 'New Folder' : 'New Project';
  }

  return {
    getSortOptions,
    getEmptyStateText,
    getCreateButtonText,
  };
}
